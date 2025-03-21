// src/pages/DisasterPage.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  ListGroup,
  Spinner,
  Alert,
  Pagination,
  InputGroup,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchDisasterMessages } from "../slice/disasterSlice";

const DisasterPage = () => {
  const dispatch = useDispatch();
  const { messages, loading, error, totalPages } = useSelector(
    (state) => state.disaster
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  // 🔄 검색어와 페이지 상태에 따라 재난 문자 요청
  useEffect(() => {
    if (searchQuery.trim() === "") {
      dispatch(
        fetchDisasterMessages({ page: currentPage, size: messagesPerPage })
      );
    } else {
      dispatch(
        fetchDisasterMessages({
          query: searchQuery,
          page: currentPage,
          size: messagesPerPage,
        })
      );
    }
  }, [dispatch, currentPage]);

  // 🔍 검색 버튼 클릭 시
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색은 항상 첫 페이지부터
    dispatch(
      fetchDisasterMessages({
        query: searchQuery,
        page: 1,
        size: messagesPerPage,
      })
    );
  };

  // 페이지네이션 렌더링
  const renderPaginationItems = () => {
    const items = [];
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
      <h2 className="text-center mb-4">🚨 재난 문자 검색</h2>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="검색어 입력 (예: 화재, 태풍)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="danger">
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

      {messages.length > 0 ? (
        <>
          <ListGroup>
            {messages.map((msg, index) => (
              <ListGroup.Item key={index} className="py-3">
                <strong>{msg.dstSeNm || "유형 미상"}</strong> - {msg.msgCn}
                <br />
                <span className="text-muted small">
                  🕒{" "}
                  {msg.crtDt
                    ? new Date(msg.crtDt).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "날짜 없음"}
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>

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

export default DisasterPage;
