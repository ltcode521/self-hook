let fiber={
  stateNode: App,
  next:null,
  memoizedState:null,
}
let isMount = true;
let workInprogressHook;


function dispatchAction(queue,action){
  let update ={
    action,
    next:null
  }
  
  if(queue.pending===null){
    update.next = update;
  }else{
    // 环状链表，我指向你指向的，，然后你指向我
    update.next = queue.pending.next;
    queue.pending.next = update
  }

  queue.pending = update;

  scheduler()
}

function useState(initialState){
  let hook;
  /**
   *  初始化阶段
   */
  if(isMount){
    //初始化定义hook
    hook = {
      next: null,
      memoizedState: initialState,
      queue:{
        pending:null,
        next:null
      }
    }


    // 添加第一个指针
    if(!fiber.memoizedState){
       fiber.memoizedState = hook;
    }else{
      // 除了第一个，2，3，4依次排在后面
      workInprogressHook.next = hook;
    }


    // 更新指针
    workInprogressHook = hook;

  }else{
    // 更新阶段
     hook = workInprogressHook; // 当前hook指向自己的指针
     workInprogressHook = workInprogressHook.next// 修复下一个指针
  }


  let baseState = hook.memoizedState;
  /**
   *  初始阶段走不到这个里面
   * 只有当触发action之后才会有hook.queue.pending,真正的更新数据也是在这里实现的
   */

  if(hook.queue.pending){
    let firstUpdate = hook.queue.pending.next; //  hook.queue.pending.next永远指向第一个；
    do{
      // 单个useState上触发queue 都去执行一遍
      const action = firstUpdate.action;
      baseState = action(baseState)
      firstUpdate = firstUpdate.next;
    } while(firstUpdate !== hook.queue.pending.next);
    // 执行完之后，将指针指向null，否则后续更新会出现问题
    hook.queue.pending = null
  }

  hook.memoizedState = baseState
  // dispatchAction，之后将更新塞到链表里面，然后useState的再次执行
  return [baseState,dispatchAction.bind(null, hook.queue)]
}

function scheduler(){
  const app = fiber.stateNode()
  workInprogressHook = fiber.memoizedState;
  isMount = false;
  return app
}




function App() {
  const [num,setNum] = useState(0)
  const [num1,setNum1] = useState(100)
  console.log(num,num1,fiber)
  return {
    click(){
      setNum(num => num+1)
    },
    focus(){
      setNum1(num1=>(num1+2))
    }
  }
}

window.app = scheduler()
