import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVersionCible } from '../version-cible.model';

@Component({
  selector: 'jhi-version-cible-detail',
  templateUrl: './version-cible-detail.component.html',
})
export class VersionCibleDetailComponent implements OnInit {
  versionCible: IVersionCible | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ versionCible }) => {
      this.versionCible = versionCible;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
