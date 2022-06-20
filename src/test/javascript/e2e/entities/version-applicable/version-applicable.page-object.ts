import { element, by, ElementFinder } from 'protractor';

export class VersionApplicableComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-version-applicable div table .btn-danger'));
  title = element.all(by.css('jhi-version-applicable div h2#page-heading span')).first();
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

export class VersionApplicableUpdatePage {
  pageTitle = element(by.id('jhi-version-applicable-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  uidVersionApplicableInput = element(by.id('field_uidVersionApplicable'));
  nameVersionApplicableInput = element(by.id('field_nameVersionApplicable'));
  commentInput = element(by.id('field_comment'));
  descriptionInput = element(by.id('field_description'));
  createDateInput = element(by.id('field_createDate'));
  modifyByInput = element(by.id('field_modifyBy'));
  modifidDateInput = element(by.id('field_modifidDate'));

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

  async setUidVersionApplicableInput(uidVersionApplicable: string): Promise<void> {
    await this.uidVersionApplicableInput.sendKeys(uidVersionApplicable);
  }

  async getUidVersionApplicableInput(): Promise<string> {
    return await this.uidVersionApplicableInput.getAttribute('value');
  }

  async setNameVersionApplicableInput(nameVersionApplicable: string): Promise<void> {
    await this.nameVersionApplicableInput.sendKeys(nameVersionApplicable);
  }

  async getNameVersionApplicableInput(): Promise<string> {
    return await this.nameVersionApplicableInput.getAttribute('value');
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

  async setCreateDateInput(createDate: string): Promise<void> {
    await this.createDateInput.sendKeys(createDate);
  }

  async getCreateDateInput(): Promise<string> {
    return await this.createDateInput.getAttribute('value');
  }

  async setModifyByInput(modifyBy: string): Promise<void> {
    await this.modifyByInput.sendKeys(modifyBy);
  }

  async getModifyByInput(): Promise<string> {
    return await this.modifyByInput.getAttribute('value');
  }

  async setModifidDateInput(modifidDate: string): Promise<void> {
    await this.modifidDateInput.sendKeys(modifidDate);
  }

  async getModifidDateInput(): Promise<string> {
    return await this.modifidDateInput.getAttribute('value');
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

export class VersionApplicableDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-versionApplicable-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-versionApplicable'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
