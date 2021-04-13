## 心路历程

### 首先react 区分加载与更新阶段

### 可以先写初始化阶段

### 其次是每个useState的都是挂载到fiber的memoizedState上的.next  .next

### 其次，dispatchAction作用是将更新队列塞到对应的memoizedState上的queue里的

### 然后触发更新，出发useState函数调用，生成新的state

### 参考卡卡颂的 hooks讲解，感谢