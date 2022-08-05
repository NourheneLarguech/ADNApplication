import { element, by, ElementFinder } from 'protractor';

export class UpdateComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-update div table .btn-danger'));
  title = element.all(by.css('jhi-update div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class UpdateUpdatePage {
  pageTitle = element(by.id('jhi-update-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  uidUpdateInput = element(by.id('field_uidUpdate'));
  versionNameInput = element(by.id('field_versionName'));
  statutSelect = element(by.id('field_statut'));
  descriptionInput = element(by.id('field_description'));
  commentInput = element(by.id('field_comment'));

  versionApplicableSelect = element(by.id('field_versionApplicable'));
  versionCibleSelect = element(by.id('field_versionCible'));
  productSelect = element(by.id('field_product'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setUidUpdateInput(uidUpdate: string): Promise<void> {
    await this.uidUpdateInput.sendKeys(uidUpdate);
  }

  async getUidUpdateInput(): Promise<string> {
    return await this.uidUpdateInput.getAttribute('value');
  }

  async setVersionNameInput(versionName: string): Promise<void> {
    await this.versionNameInput.sendKeys(versionName);
  }

  async getVersionNameInput(): Promise<string> {
    return await this.versionNameInput.getAttribute('value');
  }

  async setStatutSelect(statut: string): Promise<void> {
    await this.statutSelect.sendKeys(statut);
  }

  async getStatutSelect(): Promise<string> {
    return await this.statutSelect.element(by.css('option:checked')).getText();
  }

  async statutSelectLastOption(): Promise<void> {
    await this.statutSelect.all(by.tagName('option')).last().click();
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async setCommentInput(comment: string): Promise<void> {
    await this.commentInput.sendKeys(comment);
  }

  async getCommentInput(): Promise<string> {
    return await this.commentInput.getAttribute('value');
  }

  async versionApplicableSelectLastOption(): Promise<void> {
    await this.versionApplicableSelect.all(by.tagName('option')).last().click();
  }

  async versionApplicableSelectOption(option: string): Promise<void> {
    await this.versionApplicableSelect.sendKeys(option);
  }

  getVersionApplicableSelect(): ElementFinder {
    return this.versionApplicableSelect;
  }

  async getVersionApplicableSelectedOption(): Promise<string> {
    return await this.versionApplicableSelect.element(by.css('option:checked')).getText();
  }

  async versionCibleSelectLastOption(): Promise<void> {
    await this.versionCibleSelect.all(by.tagName('option')).last().click();
  }

  async versionCibleSelectOption(option: string): Promise<void> {
    await this.versionCibleSelect.sendKeys(option);
  }

  getVersionCibleSelect(): ElementFinder {
    return this.versionCibleSelect;
  }

  async getVersionCibleSelectedOption(): Promise<string> {
    return await this.versionCibleSelect.element(by.css('option:checked')).getText();
  }

  async productSelectLastOption(): Promise<void> {
    await this.productSelect.all(by.tagName('option')).last().click();
  }

  async productSelectOption(option: string): Promise<void> {
    await this.productSelect.sendKeys(option);
  }

  getProductSelect(): ElementFinder {
    return this.productSelect;
  }

  async getProductSelectedOption(): Promise<string> {
    return await this.productSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class UpdateDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-update-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-update'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
