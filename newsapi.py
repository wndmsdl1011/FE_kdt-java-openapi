import requests
import json
import time
from datetime import datetime, timedelta
import jaydebeapi
import logging
import schedule
import math

# 로깅 설정
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# H2 데이터베이스 설정
H2_JAR_PATH = r"C:\Program Files (x86)\H2\bin\h2-2.3.232.jar"
H2_URL = "jdbc:h2:tcp://localhost/~/newsdata;"
H2_USER = "sa"
H2_PASSWORD = ""

# API 설정 (공통)
DATA_PER_REQUEST = 30
RETURN_TYPE = "json"

# 재난 기사 API 설정
BASE_URL = "https://www.safetydata.go.kr/V2/api/DSSP-IF-00051"
SERVICE_KEY = "73SW97HIK481475V" 

# 재난 문자 API 설정
DISASTER_MESSAGE_API_URL = "https://www.safetydata.go.kr/V2/api/DSSP-IF-00247"
DISASTER_SERVICE_KEY = "8ZN1F7O3F84EK644"

# 네이버 뉴스 API 설정
NAVER_API_URL = "https://openapi.naver.com/v1/search/news.json"
NAVER_CLIENT_ID = "wzu9vM995zesToKcQJ2H"
NAVER_CLIENT_SECRET = "ciNanzY7Ye"

# H2 데이터베이스 연결
def connect_db():
    try:
        conn = jaydebeapi.connect(
            "org.h2.Driver",
            H2_URL,
            [H2_USER, H2_PASSWORD],
            H2_JAR_PATH
        )
        logging.info("Successfully connected to H2 database")
        return conn
    except Exception as e:
        logging.error(f"Failed to connect to H2 database: {e}")
        raise

# 뉴스 기사 테이블 생성
def create_table(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS news_articles (
                id IDENTITY PRIMARY KEY,
                yna_no BIGINT UNIQUE,
                crt_dt VARCHAR(255),
                yna_wrtr_nm VARCHAR(255),
                yna_cn CLOB,
                yna_ymd VARCHAR(255),
                yna_ttl VARCHAR(255),
                news_link VARCHAR(255)
            )
        """)
        try:
            cursor.execute("ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS news_link VARCHAR(255)")
        except Exception as e:
            logging.warning(f"Could not add news_link column (might already exist): {e}")
        cursor.close()
        logging.info("Table 'news_articles' created or updated with news_link column")
    except Exception as e:
        logging.error(f"Failed to create or update news_articles table: {e}")
        raise

# 재난 문자 테이블 생성
def create_disaster_messages_table(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS disaster_messages (
                id IDENTITY PRIMARY KEY,
                sn BIGINT UNIQUE,
                msg_cn CLOB,
                rcptn_rgn_nm CLOB,
                crt_dt VARCHAR(255),
                reg_ymd VARCHAR(255),
                emrg_step_nm VARCHAR(255),
                dst_se_nm VARCHAR(255),
                mdfcn_ymd VARCHAR(255)
            )
        """)
        cursor.close()
        logging.info("Table 'disaster_messages' created")
    except Exception as e:
        logging.error(f"Failed to create disaster_messages table: {e}")
        raise

# 마지막 삽입된 데이터의 날짜 조회
def get_last_inserted_date(conn, table_name):
    try:
        cursor = conn.cursor()
        cursor.execute(f"SELECT MAX({'yna_ymd' if table_name == 'news_articles' else 'reg_ymd'}) FROM {table_name}")
        result = cursor.fetchone()
        cursor.close()
        if result[0]:
            return datetime.strptime(result[0], "%Y-%m-%d %H:%M:%S" if table_name == 'news_articles' else "%Y/%m/%d %H:%M:%S.%f")
        return datetime(2025, 3, 20)
    except Exception as e:
        logging.error(f"Failed to get last inserted date from {table_name}: {e}")
        return datetime(2025, 3, 20)

# 네이버 뉴스 API 호출 및 첫 번째 링크 추출
def fetch_naver_news_link(query):
    try:
        encoded_query = requests.utils.quote(query, encoding='UTF-8')
        url = f"{NAVER_API_URL}?query={encoded_query}&display=10&start=1&sort=sim"
        headers = {
            "X-Naver-Client-Id": NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": NAVER_CLIENT_SECRET
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()    
        items = data.get("items", [])
        time.sleep(0.2)  # 0.2초 대기
        
        if not items:
            return "No link available"
        link = items[0].get("link", items[0].get("originallink", "No link available"))
        return link
    except Exception as e:
        logging.error(f"Failed to fetch news link from Naver API for query '{query}': {e}")
        return "No link available"

# 안전 데이터 API에서 데이터 가져오기 (재난 기사)
def fetch_data(page_no, crt_dt):
    params = {
        "serviceKey": SERVICE_KEY,
        "pageNo": str(page_no),
        "numOfRows": str(DATA_PER_REQUEST),
        "inqDt": crt_dt,
        "returnType": RETURN_TYPE
    }
    try:
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        header = data.get("header", {})
        if header.get("resultCode") != "00":
            logging.error(f"API error on page {page_no}: {header.get('resultMsg', 'Unknown error')}")
            return []
        data_list = data.get("body", [])
        return data_list
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching news data from API (page {page_no}): {e}")
        return []
    except ValueError as e:
        logging.error(f"Error parsing JSON response for news (page {page_no}): {e}")
        return []

# 재난 문자 API에서 데이터 가져오기
def fetch_disaster_messages(page_no, crt_dt):
    params = {
        "serviceKey": DISASTER_SERVICE_KEY,
        "pageNo": str(page_no),
        "numOfRows": str(DATA_PER_REQUEST),
        "crtDt": crt_dt,
        "returnType": RETURN_TYPE
    }
    try:
        response = requests.get(DISASTER_MESSAGE_API_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        header = data.get("header", {})
        if header.get("resultCode") != "00":
            logging.error(f"Disaster Message API error on page {page_no}: {header.get('resultMsg', 'Unknown error')}")
            return []
        data_list = data.get("body", [])
        return data_list
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching disaster messages from API (page {page_no}): {e}")
        return []
    except ValueError as e:
        logging.error(f"Error parsing JSON response for disaster messages (page {page_no}): {e}")
        return []

# 뉴스 데이터를 DB에 저장
def insert_data_to_db(conn, data_list, last_inserted_date):
    try:
        cursor = conn.cursor()
        inserted_count = 0
        for data in data_list:
            article_date = datetime.strptime(data["YNA_YMD"], "%Y-%m-%d %H:%M:%S")
            if article_date <= last_inserted_date:
                continue
            yna_no = data["YNA_NO"]
            cursor.execute("SELECT COUNT(*) FROM news_articles WHERE yna_no = ?", (yna_no,))
            if cursor.fetchone()[0] > 0:
                continue
            yna_ttl = data["YNA_TTL"]
            news_link = fetch_naver_news_link(yna_ttl)
            # 삽입 전 news_link 값 확인
            logging.debug(f"Inserting news_link for yna_no {yna_no}: {news_link}")
            if news_link is None:  # None 방지
                news_link = "No link available"
            cursor.execute("""
                INSERT INTO news_articles (yna_no, crt_dt, yna_wrtr_nm, yna_cn, yna_ymd, yna_ttl, news_link)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                yna_no,
                data["CRT_DT"],
                data["YNA_WRTR_NM"],
                data["YNA_CN"],
                data["YNA_YMD"],
                yna_ttl,
                news_link
            ))
            inserted_count += 1
        conn.commit()
        cursor.close()
        logging.info(f"Inserted {inserted_count} new articles into the database")
        return inserted_count
    except Exception as e:
        logging.error(f"Failed to insert news data into database: {e}")
        conn.rollback()
        return 0

# 재난 문자 데이터를 DB에 저장
def insert_disaster_messages_to_db(conn, data_list, last_inserted_date):
    try:
        cursor = conn.cursor()
        inserted_count = 0
        for data in data_list:
            reg_ymd_str = data["REG_YMD"][:19] + "." + data["REG_YMD"][20:26]
            message_date = datetime.strptime(reg_ymd_str, "%Y/%m/%d %H:%M:%S.%f")
            if message_date <= last_inserted_date:
                continue
            sn = data["SN"]
            cursor.execute("SELECT COUNT(*) FROM disaster_messages WHERE sn = ?", (sn,))
            if cursor.fetchone()[0] > 0:
                continue
            cursor.execute("""
                INSERT INTO disaster_messages (sn, msg_cn, rcptn_rgn_nm, crt_dt, reg_ymd, emrg_step_nm, dst_se_nm, mdfcn_ymd)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                sn,
                data["MSG_CN"],
                data["RCPTN_RGN_NM"],
                data["CRT_DT"],
                data["REG_YMD"],
                data["EMRG_STEP_NM"],
                data["DST_SE_NM"],
                data["MDFCN_YMD"]
            ))
            inserted_count += 1
        conn.commit()
        cursor.close()
        logging.info(f"Inserted {inserted_count} new disaster messages into the database")
        return inserted_count
    except Exception as e:
        logging.error(f"Failed to insert disaster messages into database: {e}")
        conn.rollback()
        return 0

# 메인 작업 함수
def fetch_and_store_news():
    conn = connect_db()
    try:
        create_table(conn)
        create_disaster_messages_table(conn)
        last_news_date = get_last_inserted_date(conn, "news_articles")
        last_message_date = get_last_inserted_date(conn, "disaster_messages")
        logging.info(f"Last inserted news date: {last_news_date}")
        logging.info(f"Last inserted message date: {last_message_date}")
        current_date = datetime(2025, 3, 20)
        end_date = datetime.now()
        news_page_no = 1
        message_page_no = 1
        news_saved_count = 0
        message_saved_count = 0
        while current_date <= end_date:
            inq_dt = current_date.strftime("%Y%m%d")
            logging.info(f"Fetching news page {news_page_no} for date {inq_dt}...")
            news_data_list = fetch_data(news_page_no, inq_dt)
            if news_data_list:
                news_inserted_count = insert_data_to_db(conn, news_data_list, last_news_date)
                news_saved_count += news_inserted_count
                logging.info(f"Saved {news_inserted_count} news records from page {news_page_no} for date {inq_dt}. Total saved: {news_saved_count}")
                news_page_no += 1
            else:
                logging.info(f"No more news data for {inq_dt}")
                news_page_no = 1
            logging.info(f"Fetching disaster messages page {message_page_no} for date {inq_dt}...")
            message_data_list = fetch_disaster_messages(message_page_no, inq_dt)
            if message_data_list:
                message_inserted_count = insert_disaster_messages_to_db(conn, message_data_list, last_message_date)
                message_saved_count += message_inserted_count
                logging.info(f"Saved {message_inserted_count} disaster messages from page {message_page_no} for date {inq_dt}. Total saved: {message_saved_count}")
                message_page_no += 1
            else:
                logging.info(f"No more disaster messages for {inq_dt}")
                message_page_no = 1
                current_date += timedelta(days=1)
    finally:
        conn.close()

# 스케줄링 작업
def run_scheduler():
    schedule.every(5).minutes.do(fetch_and_store_news)
    logging.info("스케줄러가 시작됩니다. 5분마다 뉴스 및 재난 문자를 가져옵니다.")
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    fetch_and_store_news()
    run_scheduler()