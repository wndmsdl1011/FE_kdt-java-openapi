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
  InputGroup,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const DisasterPage = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.disaster);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchDisasterMessages());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchDisasterMessages(searchQuery));
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">🚨 재난 문자 검색</h2>

      {/* ✅ 검색 UI 개선 */}
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="검색어 입력 (예: 화재, 태풍)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="danger">
            <FaSearch /> {/* 🔍 검색 아이콘 */}
          </Button>
        </InputGroup>
      </Form>

      {/* ✅ 로딩 상태 */}
      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && (
        <Alert variant="danger" className="text-center">
          ❌ {error}
        </Alert>
      )}

      {/* ✅ 재난 문자 리스트 (ListGroup 유지) */}
      {messages.length > 0 ? (
        <ListGroup>
          {messages.map((msg, index) => (
            <ListGroup.Item key={index} className="py-3">
              <strong>{msg.dstSeNm || "유형 미상"}</strong> - {msg.msgCn}
              <br />
              <span className="text-muted small">
                🕒{" "}
                {new Date(msg.crtDt).toLocaleString("ko-KR", {
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-center">🔍 검색 결과가 없습니다.</p>
      )}
    </Container>
  );
};

export default DisasterPage;
