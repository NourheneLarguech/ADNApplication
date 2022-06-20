import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUpdate } from '../update.model';

@Component({
  selector: 'jhi-update-detail',
  templateUrl: './update-detail.component.html',
})
export class UpdateDetailComponent implements OnInit {
  update: IUpdate | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ update }) => {
      this.update = update;
    });

  }

  previousState(): void {
    window.history.back();
  }
}
