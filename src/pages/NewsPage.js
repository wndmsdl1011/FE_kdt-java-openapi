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
} from "react-bootstrap";

const NewsPage = () => {
  const dispatch = useDispatch();
  const { news, loading, error } = useSelector((state) => state.news);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ 첫 로딩 시 전체 뉴스 불러오기
  useEffect(() => {
    dispatch(fetchNews()); // 초기 데이터 불러오기
  }, [dispatch]);

  // ✅ 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      dispatch(fetchNews()); // 검색어가 없으면 전체 리스트 로드
    } else {
      dispatch(fetchNews(searchQuery)); // 검색어가 있으면 필터된 리스트 로드
    }
  };

  return (
    <Container className="mt-4">
      <h2>📰 사건·사고 뉴스</h2>

      {/* 🔹 검색 입력 UI */}
      <Form onSubmit={handleSearch} className="mb-3 d-flex">
        <Form.Control
          type="text"
          placeholder="검색어 입력 (예: 화재, 교통사고)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="primary" className="ms-2">
          검색
        </Button>
      </Form>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">
          ❌ 뉴스 데이터를 불러오는데 실패했습니다.
        </Alert>
      ) : Array.isArray(news) && news.length > 0 ? (
        <Row>
          {news.map((article, index) => (
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
        <p>🔍 검색 결과가 없습니다.</p>
      )}
    </Container>
  );
};

export default NewsPage;
