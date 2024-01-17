import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {} from '@angular/router';
import { Input } from '@angular/core'; // First, import Input

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}


  sideBarOpen = true;

  open(): void {
    window.open(
      'localhost:4200/visualizer',
      '_blank',
      'status=0,scrollbars=1,resizable=1,location=1'
    );
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  hide(): void {}

  ngOnInit(): void {}
}
