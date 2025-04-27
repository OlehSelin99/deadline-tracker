import { useState, useEffect } from 'react';
import { ToDoItem } from '../../components/ToDoItem';
import { ToDoOptions } from '../../components/ToDoOptions';
import {
  Layout,
  Typography,
  Input,
  Button,
  DatePicker,
  Card,
  Space,
  message,
  Empty,
  Form,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import styles from './styles.module.css';

const { Content } = Layout;
const { Text } = Typography;

interface Todo {
  text: string;
  completed: boolean;
  deadline: string;
}

export const TodoList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (): void => {
    form
      .validateFields()
      .then(() => {
        if (!input.trim()) {
          messageApi.error('Назва завдання не може бути порожньою');
          return;
        }
        if (!deadline) {
          messageApi.error('Оберіть дедлайн для завдання');
          return;
        }

        const newTodo = {
          text: input,
          completed: false,
          deadline: deadline.format('YYYY-MM-DD'),
        };
        setTodos([...todos, newTodo]);
        setInput('');
        setDeadline(null);
        form.resetFields();

        messageApi.success('Завдання успішно додано');
      })
      .catch(() => {
        messageApi.error("Будь ласка, заповніть всі обов'язкові поля");
      });
  };

  const toggleTodo = (index: number): void => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);

    // Show success toast
    messageApi.success(
      newTodos[index].completed
        ? 'Завдання позначено як завершене'
        : 'Завдання позначено як незавершене'
    );
  };

  const deleteTodo = (index: number): void => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);

    // Show success toast
    messageApi.success('Завдання успішно видалено');
  };

  const editTodo = (index: number, newText: string, newDeadline?: string): void => {
    const newTodos = [...todos];
    newTodos[index].text = newText;
    if (newDeadline !== undefined) {
      newTodos[index].deadline = newDeadline;
    }
    setTodos(newTodos);

    // Show success toast
    messageApi.success('Завдання успішно відредаговано');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  });

  const getEmptyListMessage = () => {
    switch (filter) {
      case 'completed':
        return {
          description: 'Тут порожньо! Можливо, пора зробити щось корисне? 😉',
          image: 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg',
        };
      case 'incomplete':
        return {
          description:
            'Немає незавершених завдань! Ви або продуктивний геній, або просто забули додати щось 😄',
          image: 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg',
        };
      default:
        return {
          description:
            'Ваш список порожній! Час додати перше завдання і почати відкладати його на потім 😅',
          image: 'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg',
        };
    }
  };

  return (
    <Layout className={styles.layout}>
      {contextHolder}
      <Content className={styles.content}>
        <Card className={styles.inputCard}>
          <Form form={form} layout="inline" className={styles.formItems}>
            <Form.Item
              name="title"
              rules={[{ required: true, message: 'Введіть назву завдання' }]}
              style={{ width: '50%', margin: 0 }}
            >
              <Input
                placeholder="Нова справа..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onPressEnter={addTodo}
              />
            </Form.Item>
            <Form.Item
              name="deadline"
              rules={[{ required: true, message: 'Оберіть дедлайн' }]}
              style={{ width: '30%', margin: 0 }}
            >
              <DatePicker
                placeholder="Виберіть дедлайн"
                value={deadline}
                onChange={date => setDeadline(date)}
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                disabledDate={current => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
            <Form.Item style={{ width: '20%', margin: 0 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addTodo}
                style={{ width: '100%' }}
              >
                Додати
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card className={styles.filterCard}>
          <ToDoOptions filter={filter} onFilterChange={setFilter} />
        </Card>

        <Card className={styles.todoCard}>
          <div className={styles.todoList}>
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo, index) => (
                <ToDoItem
                  key={index}
                  todo={todo}
                  onToggle={() => toggleTodo(index)}
                  onDelete={() => deleteTodo(index)}
                  onEdit={(newText, newDeadline) => editTodo(index, newText, newDeadline)}
                  index={index}
                />
              ))
            ) : (
              <Empty
                image={getEmptyListMessage().image}
                description={
                  <Text type="secondary" style={{ fontSize: '16px' }}>
                    {getEmptyListMessage().description}
                  </Text>
                }
                style={{ margin: '40px 0' }}
              />
            )}
          </div>
        </Card>
      </Content>
    </Layout>
  );
};
