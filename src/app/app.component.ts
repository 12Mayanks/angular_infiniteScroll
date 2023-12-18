import { Component , ChangeDetectionStrategy, ViewChild, AfterViewInit, NgZone, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, pairwise, filter, throttleTime } from 'rxjs/operators';
import { timer } from 'rxjs';


// Modules
// import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    ScrollingModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.Default

})
export class AppComponent implements OnInit, AfterViewInit   {
  // title = 'infinite-scroll';
  @ViewChild('scroller')
  scroller!: CdkVirtualScrollViewport;

  title :any = "Angular Infinite Scrolling List";

  listItems :any= [];

  loading = false;

  constructor(private ngZone: NgZone , private http:HttpClient) {

  }

  ngOnInit(): void {
    this.fetchMore();
  }

  ngAfterViewInit(): void {

    this.scroller.elementScrolled().pipe(
      map(() => this.scroller.measureScrollOffset('bottom')),
      pairwise(),
      filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
      throttleTime(200)
    ).subscribe(() => {
      this.ngZone.run(() => {
        this.fetchMore();
      });
    }
    );
  }

  // fetchMore(): void {

  //   const images = ['IuLgi9PWETU', 'fIq0tET6llw', 'xcBWeU4ybqs', 'YW3F-C5e8SE', 'H90Af2TFqng'];

  //   const newItems:any = [];

  //   for (let i = 0; i < 20; i++) {
  //     const randomListNumber = Math.round(Math.random() * 100);
  //     const randomPhotoId = Math.round(Math.random() * 4);
  //     newItems.push({
  //       title: 'List Item ' + randomListNumber,
  //       content: 'This is some description of the list - item # ' + randomListNumber,
  //       image: `https://source.unsplash.com/${images[randomPhotoId]}/50x50`
  //     });
  //   }

  //   this.loading = true;
  //   timer(1000).subscribe(() => {
  //     this.loading = false;
  //     this.listItems = [...this.listItems, ...newItems];
  //   });

  // }
  fetchMore(): void {
    // Replace the random data generation with an HTTP request to your JSON server
    this.loading = true;

    // Replace the URL with the actual endpoint of your JSON server
    const apiUrl = 'http://localhost:3000/posts';

    this.http.get<any[]>(apiUrl).subscribe((newItems: any) => {
      this.loading = false;
      this.listItems = [...this.listItems, ...newItems];
    });
  }
}
