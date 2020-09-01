import { Component, OnInit } from '@angular/core';
import { Observable, interval, Subject, PartialObserver } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  isRunning = false;
  timeInt: number = 0;
  time: string = "00:00:00";
  doubleClick: number = 0;

  timer$: Observable<number>;
  timerObserver: PartialObserver<number>;

  stopClick$ = new Subject();
  pauseClick$ = new Subject();


  constructor() { }

  ngOnInit(): void {

    this.timer$ = interval(1000)
      .pipe(
        takeUntil(this.pauseClick$),
        takeUntil(this.stopClick$)
      );

    this.timerObserver = {
      next:() => {
          this.timeInt += 1;
          this.time = ("00" + Math.floor(this.timeInt/3600)).slice(-2)
           + ":" + ("00" + Math.floor(this.timeInt/60)%60).slice(-2)
           + ":" + ("00" + this.timeInt%60).slice(-2);
      }
    };
  }

    pause() {
      /*
      when clicked once add 1 to this.doubleClick and triggers setTimeout
      that counts 300ms after what set this.doubleClick to 0; If second click
      will be less than 300ms if() block will be executed.         
      */
      this.doubleClick += 1;
          if(this.doubleClick === 2) {
            this.pauseClick$.next();
            this.isRunning = false;
          }
      setTimeout(() => {
          this.doubleClick = 0;
      }, 300);
    }
  
    startStop() {
      if(!this.isRunning) {
        this.isRunning = true;
        this.timer$.subscribe(this.timerObserver);
      } else {
        this.isRunning = false;
        this.reset();
        this.stopClick$.next();
      }

    }

    reset() {
      this.timeInt = 0;
      this.time = "00:00:00";
    }
}






