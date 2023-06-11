import { RouteType } from '@/core/types';
import Todo from '@/views/pages/Todo';

const routes: RouteType[] = [
    { path: '/', redirect: '/todo-list' },
    { path: '/todo-list', view: Todo },
  ]

export default routes;