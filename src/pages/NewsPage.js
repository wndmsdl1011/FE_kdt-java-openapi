// src/pages/NewsPage.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { FaSearch, FaRegClock } from "react-icons/fa";

const NewsPage = () => {
  const dispatch = useDispatch();
  const { news, totalPages, loading, error } = useSelector(
    (state) => state.news
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 9;

  // 🔄 뉴스 데이터 요청 (검색어 or 페이지 바뀔 때)
  useEffect(() => {
    if (searchQuery.trim() === "") {
      dispatch(fetchNews({ page: currentPage, size: newsPerPage }));
    } else {
      dispatch(
        fetchNews({ query: searchQuery, page: currentPage, size: newsPerPage })
      );
    }
  }, [dispatch, currentPage]);

  // 🔍 검색 버튼
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색은 항상 첫 페이지부터
    dispatch(fetchNews({ query: searchQuery, page: 1, size: newsPerPage }));
  };

  // 페이지네이션 렌더링
  const renderPaginationItems = () => {
    let items = [];
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📰 사건·사고 뉴스</h2>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="검색어 입력 (예: 화재, 교통사고)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="primary">
            <FaSearch />
          </Button>
        </InputGroup>
      </Form>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && (
        <Alert variant="danger" className="text-center">
          {typeof error === "string"
            ? error
            : error.message || "에러가 발생했습니다."}
        </Alert>
      )}

      {news.length > 0 ? (
        <>
          <Row>
            {news.map((article, index) => {
              const formattedDate = article.ynaYmd
                ? new Date(article.ynaYmd).toLocaleString("ko-KR", {
                    year: "numeric",
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

          <Pagination className="justify-content-center mt-4">
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {renderPaginationItems()}
            <Pagination.Next
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </>
      ) : (
        !loading && <p className="text-center">🔍 검색 결과가 없습니다.</p>
      )}
    </Container>
  );
};

export default NewsPage;
