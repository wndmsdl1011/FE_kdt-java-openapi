import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDisasterMessages } from "../slice/disasterSlice";
import {
  Container,
  Form,
  Button,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";

const DisasterPage = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.disaster);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // 페이지 로딩 시 전체 재난 데이터
    dispatch(fetchDisasterMessages());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchDisasterMessages(searchQuery));
  };

  return (
    <Container className="mt-4">
      <h2>🚨 재난 문자 검색</h2>

      {/* 검색 UI */}
      <Form onSubmit={handleSearch} className="mb-3 d-flex">
        <Form.Control
          type="text"
          placeholder="검색어 (예: 화재, 태풍)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="danger" className="ms-2">
          검색
        </Button>
      </Form>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        // 🔹 error가 객체가 아니라 문자열이므로 그대로 렌더링 가능
        <Alert variant="danger">❌ {error}</Alert>
      ) : messages.length > 0 ? (
        <ListGroup>
          {messages.map((msg, index) => (
            <ListGroup.Item key={index}>
              <strong>{msg.dstSeNm || "유형 미상"}</strong> - {msg.msgCn}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </Container>
  );
};

export default DisasterPage;
