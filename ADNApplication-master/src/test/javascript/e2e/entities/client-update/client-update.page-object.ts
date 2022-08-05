import { element, by, ElementFinder } from 'protractor';

export class ClientUpdateComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-client-update div table .btn-danger'));
  title = element.all(by.css('jhi-client-update div h2#page-heading span')).first();
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

export class ClientUpdateUpdatePage {
  pageTitle = element(by.id('jhi-client-update-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));

  clientSelect = element(by.id('field_client'));
  updateSelect = element(by.id('field_update'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async clientSelectLastOption(): Promise<void> {
    await this.clientSelect.all(by.tagName('option')).last().click();
  }

  async clientSelectOption(option: string): Promise<void> {
    await this.clientSelect.sendKeys(option);
  }

  getClientSelect(): ElementFinder {
    return this.clientSelect;
  }

  async getClientSelectedOption(): Promise<string> {
    return await this.clientSelect.element(by.css('option:checked')).getText();
  }

  async updateSelectLastOption(): Promise<void> {
    await this.updateSelect.all(by.tagName('option')).last().click();
  }

  async updateSelectOption(option: string): Promise<void> {
    await this.updateSelect.sendKeys(option);
  }

  getUpdateSelect(): ElementFinder {
    return this.updateSelect;
  }

  async getUpdateSelectedOption(): Promise<string> {
    return await this.updateSelect.element(by.css('option:checked')).getText();
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

export class ClientUpdateDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-clientUpdate-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-clientUpdate'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
