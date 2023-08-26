# Trader visualizer

## Modules: 
- [Trader](#Trader)

# <a href="Trader"></a> Trader
Trader module exports 3 main **commands**: 
1. **start()** -> void: this is where the trader logic is placed. It is divided into 3 parts: **Initialization**, **main loop** and **deallocaton**;
2. **is_running()**: this method is used to ask the trader whather it is **running** or not;
3. **is_paused()**: this method is used to ask the trader whather it is **paused** or not.

The main loop contains 4 important variables: 
1. **stop**: this variable is used into the main loop to decide if the process has to continue or to **stop**;
2. **pause**: this variable is used into the main loop to decide if the thread has to **park** so that the trader can pause without taking resources;
3. **stop_handler**: this handler is used to listen whenever a **SET_STOP_EVENT** is emitted or triggered. Its purpose is to handle the thread by changing the **stop** variable value and **unparking** the thread so that the loop can get to its end;
4. **pause_handler**: this handler is used to listen whenever a **SET_PAUSE_EVENT** is emitted or triggered. Its purpose is to handle the thread by changing the **pause** variable value and **unparking** the thread so that the loop can resume.

Note: The value returned by the **is_running()** and **is_paused()** methods are **NOT** the same as the **stop** and **pause** variables. The global RUNNING and PAUSED variables are changed only once the trader has stopper or paused, and not when it is in the process.

The module also contains 2 internal private methods: 
1. **set_running(running: bool, app: AppHandle)**: this method is used to set the **RUNNING** global variable and to emit a **RUNNING_VALUE_CHANGED_EVENT**;
2. **set_paused(paused: bool, app: AppHandle)**: this method is used to set the **PAUSED** global variable and to emit a **PAUSED_VALUE_CHANGED_EVENT**;

## How to use

### Start the trader:
To start the trader it is necessary to invoke the **start()** command. The method will then handle everything by itself.

From rust: 
```rust
use crate::trader::start;
...
start();
```

From typescript: 
```typescript
import { invoke } from "@tauri-apps/api/tauri";
import { START_COMMAND } from "../consts";
...
await invoke(START_COMMAND);
```

### Stop the trader: 
To stop the trader it is necessary to emit a **SET_STOP_EVENT**. The handler will handle everything by itself.

From rust: 
```rust
use crate::consts::SET_STOP_EVENT;
...
let app: AppHandle = ...;
app.emit_all(SET_STOP_EVENT, "");
```

From typescript: 
```typescript
import { SET_STOP_EVENT } from "../consts";
import { emit } from "@tauri-apps/api/event";
...
emit(SET_STOP_EVENT, "");
```

### Pause/Resume the trader: 
To pause and Resume the trader it is necessary to emit a **SET_PAUSE_EVENT**. The handler will handle everything by itself.

Note: The trader can be paused only if it is running. Also the event is handled as a trigger, so if the trader is paused and the event is emitted, the trader will resume.

From rust: 
```rust
use crate::consts::SET_PAUSE_EVENT;
...
let app: AppHandle = ...;
app.emit_all(SET_PAUSE_EVENT, "");
```

From typescript: 
```typescript
import { SET_PAUSE_EVENT } from "../consts";
import { emit } from "@tauri-apps/api/event";
...
emit(SET_PAUSE_EVENT, "");
```

### Get the trader running status:
To get the trader running status it is necessary to invoke the **is_running()** command.

From rust: 
```rust
use crate::trader::is_running;
...
let running: bool = is_running();
```

From typescript: 
```typescript
import { invoke } from "@tauri-apps/api/tauri";
import { IS_RUNNING_COMMAND } from "../consts";
...
let running: bool = await invoke(IS_RUNNING_COMMAND);
```

### Get the trader paused status:
To get the trader paused status it is necessary to invoke the **is_paused()** command.

From rust: 
```rust
use crate::trader::is_paused;
...
let paused: bool = is_paused();
```

From typescript: 
```typescript
import { invoke } from "@tauri-apps/api/tauri";
import { IS_PAUSED_COMMAND } from "../consts";
...
let paused: bool = await invoke(IS_PAUSED_COMMAND);
```