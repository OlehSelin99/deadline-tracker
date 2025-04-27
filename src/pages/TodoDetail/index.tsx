import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Typography, Card, Button, Space, Tag, Divider, message } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './styles.module.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface Todo {
  text: string;
  completed: boolean;
  deadline: string;
}

export const TodoDetail: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    // Get todos from localStorage
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const todos = JSON.parse(savedTodos);
      const todoIndex = parseInt(id || '0', 10);
      if (todos[todoIndex]) {
        setTodo(todos[todoIndex]);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (todo?.deadline) {
      const timer = setInterval(() => {
        const now = dayjs();
        const deadline = dayjs(todo.deadline);
        const diff = deadline.diff(now, 'day');

        if (diff < 0) {
          setTimeLeft('Прострочено');
        } else if (diff === 0) {
          const hours = deadline.diff(now, 'hour');
          if (hours < 0) {
            setTimeLeft('Прострочено');
          } else if (hours === 0) {
            const minutes = deadline.diff(now, 'minute');
            setTimeLeft(`Залишилось ${minutes} хвилин`);
          } else {
            setTimeLeft(`Залишилось ${hours} годин`);
          }
        } else {
          setTimeLeft(`Залишилось ${diff} днів`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [todo?.deadline]);

  const handleToggleComplete = () => {
    if (!todo) return;

    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const todos = JSON.parse(savedTodos);
      const todoIndex = parseInt(id || '0', 10);

      if (todos[todoIndex]) {
        todos[todoIndex].completed = !todos[todoIndex].completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        setTodo({ ...todo, completed: !todo.completed });

        // Show success toast
        messageApi.success(
          !todo.completed ? 'Завдання позначено як завершене' : 'Завдання позначено як незавершене'
        );
      }
    }
  };

  if (!todo) {
    return null;
  }

  return (
    <Layout className={styles.layout}>
      {contextHolder}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        className={styles.backButton}
      >
        Назад
      </Button>
      <Content className={styles.content}>
        <Card className={styles.detailCard}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className={styles.headerSection}>
              <Title level={3} className={styles.todoTitle}>
                {todo.text}
              </Title>
              <Tag
                color={todo.completed ? 'success' : 'processing'}
                icon={todo.completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
              >
                {todo.completed ? 'Завершено' : 'В процесі'}
              </Tag>
            </div>

            <Divider />

            <div className={styles.infoSection}>
              <Title level={4}>Інформація про завдання</Title>

              <div className={styles.infoItem}>
                <Text strong>Статус:</Text>
                <Text>{todo.completed ? 'Завершено' : 'В процесі'}</Text>
              </div>

              {todo.deadline && (
                <div className={styles.infoItem}>
                  <Text strong>Дедлайн:</Text>
                  <Text>{dayjs(todo.deadline).format('DD/MM/YYYY')}</Text>
                </div>
              )}

              {todo.deadline && (
                <div className={styles.infoItem}>
                  <Text strong>Час до дедлайну:</Text>
                  <Text>{timeLeft}</Text>
                </div>
              )}
            </div>

            <Divider />

            <div className={styles.actionsSection}>
              <Button
                type="primary"
                onClick={handleToggleComplete}
                icon={todo.completed ? <ClockCircleOutlined /> : <CheckCircleOutlined />}
              >
                {todo.completed ? 'Позначити як незавершене' : 'Позначити як завершене'}
              </Button>
            </div>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};
