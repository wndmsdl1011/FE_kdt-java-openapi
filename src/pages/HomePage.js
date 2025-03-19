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

      {/* 뉴스 섹션 */}
      <h2>📰 최신 뉴스</h2>
      {newsLoading ? (
        <Spinner animation="border" />
      ) : newsError ? (
        <Alert variant="danger">뉴스 데이터를 불러오는데 실패했습니다.</Alert>
      ) : Array.isArray(news) && news.length > 0 ? (
        <Row>
          {news.slice(0, 3).map((article, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{article.ynaTtl || "제목 없음"}</Card.Title>
                  <Card.Text>
                    {article.ynaCn
                      ? article.ynaCn.substring(0, 100) + "..."
                      : "내용 없음"}
                  </Card.Text>
                  <Button
                    variant="link"
                    href={article.newsLink}
                    target="_blank"
                  >
                    기사 보기
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>불러올 뉴스가 없습니다.</p>
      )}
      <Button
        variant="primary"
        className="mt-2"
        onClick={() => navigate("/news")}
      >
        전체 뉴스 보기
      </Button>

      <hr />

      {/* 재난 문자 섹션 */}
      <h2>⚠️ 재난 경보</h2>
      {disasterLoading ? (
        <Spinner animation="border" />
      ) : disasterError ? (
        <Alert variant="danger">
          재난 문자 데이터를 불러오는데 실패했습니다.
        </Alert>
      ) : Array.isArray(messages) && messages.length > 0 ? (
        <Row>
          {messages.slice(0, 3).map((msg, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card bg="warning">
                <Card.Body>
                  <Card.Title>
                    {msg.dstSeNm || "알 수 없는 재난 유형"}
                  </Card.Title>
                  <Card.Text>{msg.msgCn || "내용 없음"}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>불러올 재난 경보가 없습니다.</p>
      )}
      <Button
        variant="danger"
        className="mt-2"
        onClick={() => navigate("/disaster")}
      >
        재난 문자 보기
      </Button>
    </Container>
  );
};

export default HomePage;
