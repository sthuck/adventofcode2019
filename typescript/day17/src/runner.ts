import * as fs from 'fs';
import * as path from 'path';
import {task1, walkMapHelper, task2} from './index';
class AsyncPrint {
  constructor(private frameGap = 200) {}
  done_ = false;
  private currentFrame = 0;
  private frames = [];
  private resolve;
  private p = new Promise(resolve => this.resolve = resolve);

  addFrame(frame) {
    this.frames.push(frame);
  }

  async print() {
    while (!this.done_ || this.currentFrame < this.frames.length) {
      if (this.currentFrame < this.frames.length) {
        const frame = this.frames[this.currentFrame];
        process.stdout.write('\x1b[2J');
        console.log(frame);
        this.currentFrame++;
      }
      await new Promise(resolve => setTimeout(resolve, this.frameGap));
    }
    this.resolve();
  }

  done() {
    this.done_ = true;
    return this.p;
  }
}
global.asyncPrint = new AsyncPrint(50);
declare global {
  namespace NodeJS {
    interface Global {
      asyncPrint: AsyncPrint
    }
  }
}

const readFile = (filename: string): string =>
  // fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('');
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

const day17_1 = async () => {
  const input = readFile('./input-1');
  const result = await task1(input);
  console.log({result});
}

const day17_2 = async () => {
  const input = readFile('./input-1');
  const result = await task2(input);
  await global.asyncPrint.done()
  console.log({result});
}

// day17_1();
global.asyncPrint.print();
day17_2();


