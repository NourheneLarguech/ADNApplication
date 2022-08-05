import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVersionApplicable } from '../version-applicable.model';

@Component({
  selector: 'jhi-version-applicable-detail',
  templateUrl: './version-applicable-detail.component.html',
})
export class VersionApplicableDetailComponent implements OnInit {
  versionApplicable: IVersionApplicable | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ versionApplicable }) => {
      this.versionApplicable = versionApplicable;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
