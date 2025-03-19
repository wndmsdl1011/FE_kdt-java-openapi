import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../slice/newsSlice";
import { fetchDisasterMessages } from "../slice/disasterSlice";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaRegClock } from "react-icons/fa"; // 🕒 시계 아이콘

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    news,
    loading: newsLoading,
    error: newsError,
  } = useSelector((state) => state.news);
  const {
    messages,
    loading: disasterLoading,
    error: disasterError,
  } = useSelector((state) => state.disaster);

  useEffect(() => {
    dispatch(fetchNews());
    dispatch(fetchDisasterMessages());
  }, [dispatch]);

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">📢 재난 & 뉴스 알리미</h1>

      {/* ✅ 최신 뉴스 섹션 */}
      <h2 className="mb-3">📰 최신 뉴스</h2>
      {newsLoading ? (
        <Spinner animation="border" className="d-block mx-auto" />
      ) : newsError ? (
        <Alert variant="danger" className="text-center">
          ❌ 뉴스 데이터를 불러오는데 실패했습니다.
        </Alert>
      ) : Array.isArray(news) && news.length > 0 ? (
        <Row>
          {news.slice(0, 3).map((article, index) => {
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
                    <Card.Title className="fw-bold">
                      {article.ynaTtl || "제목 없음"}
                    </Card.Title>
                    <Card.Text className="text-muted">
                      {article.ynaCn
                        ? article.ynaCn.substring(0, 100) + "..."
                        : "내용 없음"}
                    </Card.Text>

                    {/* ✅ 시간 & 기사 보기 버튼 같은 줄 */}
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
      ) : (
        <p className="text-center">📰 불러올 뉴스가 없습니다.</p>
      )}
      <Button
        variant="primary"
        className="mt-3 d-block mx-auto"
        onClick={() => navigate("/news")}
      >
        전체 뉴스 보기 →
      </Button>

      <hr />

      {/* ✅ 재난 문자 섹션 */}
      <h2 className="mb-3">⚠️ 재난 경보</h2>
      {disasterLoading ? (
        <Spinner animation="border" className="d-block mx-auto" />
      ) : disasterError ? (
        <Alert variant="danger" className="text-center">
          ❌ 재난 문자 데이터를 불러오는데 실패했습니다.
        </Alert>
      ) : Array.isArray(messages) && messages.length > 0 ? (
        <Row>
          {messages.slice(0, 3).map((msg, index) => {
            const formattedDate = msg.crtDt
              ? new Date(msg.crtDt).toLocaleString("ko-KR", {
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "날짜 없음";

            return (
              <Col md={4} key={index} className="mb-4">
                <Card bg="warning" className="shadow-sm">
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      {msg.dstSeNm || "알 수 없는 재난 유형"}
                    </Card.Title>
                    <Card.Text>{msg.msgCn || "내용 없음"}</Card.Text>

                    {/* ✅ 등록 시간 추가 */}
                    <div className="text-muted small">
                      <FaRegClock className="me-1" /> {formattedDate}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <p className="text-center">⚠️ 불러올 재난 경보가 없습니다.</p>
      )}
      <Button
        variant="danger"
        className="mt-3 d-block mx-auto"
        onClick={() => navigate("/disaster")}
      >
        재난 문자 보기 →
      </Button>
    </Container>
  );
};

export default HomePage;
