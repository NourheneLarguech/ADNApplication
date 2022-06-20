import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { UpdateComponentsPage, UpdateDeleteDialog, UpdateUpdatePage } from './update.page-object';

const expect = chai.expect;

describe('Update e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let updateComponentsPage: UpdateComponentsPage;
  let updateUpdatePage: UpdateUpdatePage;
  let updateDeleteDialog: UpdateDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Updates', async () => {
    await navBarPage.goToEntity('update');
    updateComponentsPage = new UpdateComponentsPage();
    await browser.wait(ec.visibilityOf(updateComponentsPage.title), 5000);
    expect(await updateComponentsPage.getTitle()).to.eq('adnApplicationApp.update.home.title');
    await browser.wait(ec.or(ec.visibilityOf(updateComponentsPage.entities), ec.visibilityOf(updateComponentsPage.noResult)), 1000);
  });

  it('should load create Update page', async () => {
    await updateComponentsPage.clickOnCreateButton();
    updateUpdatePage = new UpdateUpdatePage();
    expect(await updateUpdatePage.getPageTitle()).to.eq('adnApplicationApp.update.home.createOrEditLabel');
    await updateUpdatePage.cancel();
  });

  it('should create and save Updates', async () => {
    const nbButtonsBeforeCreate = await updateComponentsPage.countDeleteButtons();

    await updateComponentsPage.clickOnCreateButton();

    await promise.all([
      updateUpdatePage.setUidUpdateInput('uidUpdate'),
      updateUpdatePage.setVersionNameInput('versionName'),
      updateUpdatePage.statutSelectLastOption(),
      updateUpdatePage.setDescriptionInput('description'),
      updateUpdatePage.setCommentInput('comment'),
      updateUpdatePage.versionApplicableSelectLastOption(),
      updateUpdatePage.versionCibleSelectLastOption(),
      updateUpdatePage.productSelectLastOption(),
    ]);

    await updateUpdatePage.save();
    expect(await updateUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await updateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Update', async () => {
    const nbButtonsBeforeDelete = await updateComponentsPage.countDeleteButtons();
    await updateComponentsPage.clickOnLastDeleteButton();

    updateDeleteDialog = new UpdateDeleteDialog();
    expect(await updateDeleteDialog.getDialogTitle()).to.eq('adnApplicationApp.update.delete.question');
    await updateDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(updateComponentsPage.title), 5000);

    expect(await updateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
