const cp = require('child_process')

class Process {
  constructor(command, env = null, cwd = null) {
    // executor object
    this.executor = null
    this.spawnParams = [command, env, cwd]
    // event handlers     
    onStdoutData: () => { }
    onStderrData: () => { }
    onError: () => { }
    onExit: () => { }
  }

  spawn() {
    // TODO: for commands like "ls -l 'Documents and Settings'" it will be failed!
    const [command, env, cwd] = this.spawnParams

    const args = command.split(' ')
    const cmd = args.shift()
    const options = {
      env: Object.assign(process.env, env),
      cwd: cwd,
    }
    this.executor = cp.spawn(cmd, args, options)
    this._bindEvents()
  }

  kill(signal = 'SIGINT') {
    this.executor.kill(signal)
  }

  _bindEvents() {
    const { onStdoutData, onStderrData, onError, onExit } = this.eventHandlers
    const executor = this.executor
    // bind events with corresponded handlers
    executor.stdout.on('data', this.onStdoutData)
    executor.stderr.on('data', this.onStderrData)
    executor.on('error', this.onError)
    executor.on('exit', this.onExit)
  }
}

module.exports = Process