import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { VersionCibleComponentsPage, VersionCibleDeleteDialog, VersionCibleUpdatePage } from './version-cible.page-object';

const expect = chai.expect;

describe('VersionCible e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let versionCibleComponentsPage: VersionCibleComponentsPage;
  let versionCibleUpdatePage: VersionCibleUpdatePage;
  let versionCibleDeleteDialog: VersionCibleDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load VersionCibles', async () => {
    await navBarPage.goToEntity('version-cible');
    versionCibleComponentsPage = new VersionCibleComponentsPage();
    await browser.wait(ec.visibilityOf(versionCibleComponentsPage.title), 5000);
    expect(await versionCibleComponentsPage.getTitle()).to.eq('adnApplicationApp.versionCible.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(versionCibleComponentsPage.entities), ec.visibilityOf(versionCibleComponentsPage.noResult)),
      1000
    );
  });

  it('should load create VersionCible page', async () => {
    await versionCibleComponentsPage.clickOnCreateButton();
    versionCibleUpdatePage = new VersionCibleUpdatePage();
    expect(await versionCibleUpdatePage.getPageTitle()).to.eq('adnApplicationApp.versionCible.home.createOrEditLabel');
    await versionCibleUpdatePage.cancel();
  });

  it('should create and save VersionCibles', async () => {
    const nbButtonsBeforeCreate = await versionCibleComponentsPage.countDeleteButtons();

    await versionCibleComponentsPage.clickOnCreateButton();

    await promise.all([
      versionCibleUpdatePage.setUidVersionCibleInput('uidVersionCible'),
      versionCibleUpdatePage.setNameVersionCibleInput('nameVersionCible'),
      versionCibleUpdatePage.setCommentInput('comment'),
      versionCibleUpdatePage.setDescriptionInput('description'),
      versionCibleUpdatePage.setCreateDateInput('createDate'),
      versionCibleUpdatePage.setModifyByInput('modifyBy'),
      versionCibleUpdatePage.setModifidDateInput('modifidDate'),
      versionCibleUpdatePage.productSelectLastOption(),
    ]);

    await versionCibleUpdatePage.save();
    expect(await versionCibleUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await versionCibleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last VersionCible', async () => {
    const nbButtonsBeforeDelete = await versionCibleComponentsPage.countDeleteButtons();
    await versionCibleComponentsPage.clickOnLastDeleteButton();

    versionCibleDeleteDialog = new VersionCibleDeleteDialog();
    expect(await versionCibleDeleteDialog.getDialogTitle()).to.eq('adnApplicationApp.versionCible.delete.question');
    await versionCibleDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(versionCibleComponentsPage.title), 5000);

    expect(await versionCibleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
