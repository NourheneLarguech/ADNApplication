import { element, by, ElementFinder } from 'protractor';

export class ClientComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-client div table .btn-danger'));
  title = element.all(by.css('jhi-client div h2#page-heading span')).first();
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

export class ClientUpdatePage {
  pageTitle = element(by.id('jhi-client-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  uidClientInput = element(by.id('field_uidClient'));
  nameClientInput = element(by.id('field_nameClient'));
  productClientInput = element(by.id('field_productClient'));
  commentInput = element(by.id('field_comment'));
  descriptionInput = element(by.id('field_description'));
  statutSelect = element(by.id('field_statut'));

  client_productSelect = element(by.id('field_client_product'));
  versionApplicableSelect = element(by.id('field_versionApplicable'));
  versionCibleSelect = element(by.id('field_versionCible'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setUidClientInput(uidClient: string): Promise<void> {
    await this.uidClientInput.sendKeys(uidClient);
  }

  async getUidClientInput(): Promise<string> {
    return await this.uidClientInput.getAttribute('value');
  }

  async setNameClientInput(nameClient: string): Promise<void> {
    await this.nameClientInput.sendKeys(nameClient);
  }

  async getNameClientInput(): Promise<string> {
    return await this.nameClientInput.getAttribute('value');
  }

  async setProductClientInput(productClient: string): Promise<void> {
    await this.productClientInput.sendKeys(productClient);
  }

  async getProductClientInput(): Promise<string> {
    return await this.productClientInput.getAttribute('value');
  }

  async setCommentInput(comment: string): Promise<void> {
    await this.commentInput.sendKeys(comment);
  }

  async getCommentInput(): Promise<string> {
    return await this.commentInput.getAttribute('value');
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
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

  async client_productSelectLastOption(): Promise<void> {
    await this.client_productSelect.all(by.tagName('option')).last().click();
  }

  async client_productSelectOption(option: string): Promise<void> {
    await this.client_productSelect.sendKeys(option);
  }

  getClient_productSelect(): ElementFinder {
    return this.client_productSelect;
  }

  async getClient_productSelectedOption(): Promise<string> {
    return await this.client_productSelect.element(by.css('option:checked')).getText();
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

export class ClientDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-client-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-client'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
