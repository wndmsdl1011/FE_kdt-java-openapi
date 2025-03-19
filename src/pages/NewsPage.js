import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../slice/newsSlice";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Pagination,
  InputGroup,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa"; // 🔍 검색 아이콘
import { FaRegClock } from "react-icons/fa"; // 🕒 시계 아이콘

const NewsPage = () => {
  const dispatch = useDispatch();
  const { news, loading, error } = useSelector((state) => state.news);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ 페이지네이션 상태값
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 9; // 한 페이지당 뉴스 개수

  // ✅ 첫 로딩 시 전체 뉴스 불러오기
  useEffect(() => {
    dispatch(fetchNews()); // 전체 뉴스 불러오기
  }, [dispatch]);

  // ✅ 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 첫 페이지로 초기화
    dispatch(fetchNews(searchQuery));
  };

  // ✅ 현재 페이지에 표시할 뉴스 계산
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = Array.isArray(news)
    ? news.slice(indexOfFirstNews, indexOfLastNews)
    : [];

  // ✅ 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📰 사건·사고 뉴스</h2>

      {/* 🔹 검색 입력 UI */}
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="검색어 입력 (예: 화재, 교통사고)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="primary">
            <FaSearch /> {/* 🔍 검색 아이콘 */}
          </Button>
        </InputGroup>
      </Form>

      {/* ✅ 로딩 상태 표시 */}
      {loading && <Spinner animation="border" className="d-block mx-auto" />}

      {/* ✅ 에러 발생 시 알림 */}
      {error && (
        <Alert variant="danger" className="text-center">
          ❌ 뉴스 데이터를 불러오는데 실패했습니다.
        </Alert>
      )}

      {/* ✅ 뉴스 리스트 렌더링 */}
      {currentNews.length > 0 ? (
        <>
          <Row>
            {currentNews.map((article, index) => {
              const formattedDate = article.crtDt
                ? new Date(article.crtDt).toLocaleString("ko-KR", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "날짜 없음";

              return (
                <Col md={4} key={index} className="mb-4">
                  <Card className="shadow-sm h-100">
                    <Card.Body>
                      {/* ✅ 뉴스 제목 */}
                      <Card.Title className="fw-bold">
                        {article.ynaTtl || "제목 없음"}
                      </Card.Title>

                      {/* ✅ 뉴스 내용 */}
                      <Card.Text className="text-muted">
                        {article.ynaCn
                          ? article.ynaCn.substring(0, 100) + "..."
                          : "내용 없음"}
                      </Card.Text>

                      {/* ✅ 시간 & 기사 보기 버튼 (같은 줄) */}
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">
                          <FaRegClock className="me-1" /> {formattedDate}
                        </span>
                        <Button
                          variant="outline-primary"
                          href={article.newsLink}
                          target="_blank"
                          size="sm"
                        >
                          기사 보기 →
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* ✅ 페이지네이션 UI */}
          <Pagination className="justify-content-center mt-4">
            {[...Array(Math.ceil(news.length / newsPerPage)).keys()].map(
              (number) => (
                <Pagination.Item
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              )
            )}
          </Pagination>
        </>
      ) : (
        <p className="text-center">🔍 검색 결과가 없습니다.</p>
      )}
    </Container>
  );
};

export default NewsPage;
