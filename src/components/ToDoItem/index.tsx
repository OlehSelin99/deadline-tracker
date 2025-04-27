import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeadlineTimer } from '../DeadlineTimer';
import { Button, Space, Form, Tooltip, message, Modal, Input, DatePicker } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  RightOutlined,
  ShareAltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './styles.module.css';
import Confetti from 'react-confetti';
import { createPortal } from 'react-dom';

interface Todo {
  text: string;
  completed: boolean;
  deadline: string;
}

interface ToDoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newText: string, newDeadline?: string) => void;
  index: number;
}

export const ToDoItem: React.FC<ToDoItemProps> = ({ todo, onToggle, onDelete, onEdit, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDeadline, setEditDeadline] = useState<dayjs.Dayjs | null>(
    todo.deadline ? dayjs(todo.deadline) : null
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();
  const inputRef = useRef<any>(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    if (!todo.completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000); // Increased from 5000 to 8000 ms
      messageApi.success('Завдання успішно завершено! 🎉');
    } else {
      messageApi.info('Завдання позначено як незавершене');
    }
    onToggle();
  };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editText.trim() === '') {
      messageApi.error('Завдання не може бути порожнім');
      return;
    }
    onEdit(editText, editDeadline ? editDeadline.format('YYYY-MM-DD') : '');
    setIsEditing(false);

    // Show success toast
    messageApi.success('Завдання успішно відредаговано');
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditText(todo.text);
    setEditDeadline(todo.deadline ? dayjs(todo.deadline) : null);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit(e as any);
    } else if (e.key === 'Escape') {
      handleCancel(e as any);
    }
  };

  const showDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    messageApi.success('Завдання успішно видалено');
    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleItemClick = () => {
    navigate(`/todo/${index}`);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/todo/${index}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: todo.text,
          text: `Check out this todo: ${todo.text}`,
          url: shareUrl,
        });
        messageApi.success('Завдання успішно поширено!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          messageApi.error('Помилка при поширенні завдання');
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          messageApi.success('Посилання скопійовано в буфер обміну!');
        })
        .catch(() => {
          messageApi.error('Помилка при копіюванні посилання');
        });
    }
  };

  return (
    <>
      <div className={styles.todoItem}>
        {contextHolder}
        {isEditing ? (
          <Form form={form} layout="vertical" className={styles.editForm}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item
                name="text"
                initialValue={editText}
                rules={[{ required: true, message: 'Введіть текст завдання' }]}
              >
                <Input
                  ref={inputRef}
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Введіть текст завдання"
                  suffix={
                    <Space>
                      <Tooltip title="Зберегти (Enter)">
                        <Button
                          type="text"
                          icon={<SaveOutlined />}
                          onClick={handleEdit}
                          size="small"
                        />
                      </Tooltip>
                      <Tooltip title="Скасувати (Esc)">
                        <Button
                          type="text"
                          icon={<CloseOutlined />}
                          onClick={handleCancel}
                          size="small"
                        />
                      </Tooltip>
                    </Space>
                  }
                />
              </Form.Item>
              <Form.Item name="deadline" initialValue={editDeadline}>
                <DatePicker
                  value={editDeadline}
                  onChange={date => setEditDeadline(date)}
                  format="DD/MM/YYYY"
                  placeholder="Виберіть дедлайн"
                  style={{ width: '100%' }}
                  disabledDate={current => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Space>
          </Form>
        ) : (
          <div className={styles.todoContent}>
            <span className={`${styles.todoText} ${todo.completed ? styles.completed : ''}`}>
              Мета: {todo.text}
            </span>

            <Space size="small">
              <Tooltip title="Редагувати">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={startEditing}
                  className={styles.actionButton}
                />
              </Tooltip>
              <Tooltip title="Поширити">
                <Button
                  type="text"
                  icon={<ShareAltOutlined />}
                  onClick={handleShare}
                  className={styles.actionButton}
                />
              </Tooltip>
              <Tooltip title="Видалити">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={showDeleteModal}
                  className={`${styles.actionButton} ${styles.danger}`}
                />
              </Tooltip>
              <Tooltip title="Деталі">
                <Button
                  type="text"
                  icon={<RightOutlined />}
                  onClick={handleItemClick}
                  className={styles.actionButton}
                />
              </Tooltip>
            </Space>
          </div>
        )}
        <Space
          align="end"
          style={{
            justifyContent: 'space-between',
            flexDirection: 'column',
            width: '100%',
            flexWrap: 'wrap',
          }}
        >
          <DeadlineTimer deadline={todo.deadline} completed={todo.completed} />
          <Button
            type="primary"
            onClick={handleToggle}
            icon={todo.completed ? <ClockCircleOutlined /> : <CheckCircleOutlined />}
            className={styles.completeButton}
          >
            {todo.completed ? 'Позначити як незавершене' : 'Позначити як завершене'}
          </Button>
        </Space>
      </div>
      {showConfetti &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={500}
              gravity={0.5}
              initialVelocityY={30}
              initialVelocityX={15}
              colors={[
                '#2196F3',
                '#4CAF50',
                '#FF9800',
                '#E91E63',
                '#9C27B0',
                '#FFEB3B',
                '#00BCD4',
                '#FF5722',
              ]}
            />
          </div>,
          document.body
        )}

      <Modal
        title="Видалити завдання?"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Так, видалити"
        cancelText="Ні, залишити"
        okButtonProps={{ danger: true }}
      >
        <div>
          <p>Ви впевнені, що хочете видалити це завдання?</p>
          <p>Воно буде видалено назавжди... ну, поки ви не створите нове 😉</p>
        </div>
      </Modal>
    </>
  );
};
