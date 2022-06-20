import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  VersionApplicableComponentsPage,
  VersionApplicableDeleteDialog,
  VersionApplicableUpdatePage,
} from './version-applicable.page-object';

const expect = chai.expect;

describe('VersionApplicable e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let versionApplicableComponentsPage: VersionApplicableComponentsPage;
  let versionApplicableUpdatePage: VersionApplicableUpdatePage;
  let versionApplicableDeleteDialog: VersionApplicableDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load VersionApplicables', async () => {
    await navBarPage.goToEntity('version-applicable');
    versionApplicableComponentsPage = new VersionApplicableComponentsPage();
    await browser.wait(ec.visibilityOf(versionApplicableComponentsPage.title), 5000);
    expect(await versionApplicableComponentsPage.getTitle()).to.eq('adnApplicationApp.versionApplicable.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(versionApplicableComponentsPage.entities), ec.visibilityOf(versionApplicableComponentsPage.noResult)),
      1000
    );
  });

  it('should load create VersionApplicable page', async () => {
    await versionApplicableComponentsPage.clickOnCreateButton();
    versionApplicableUpdatePage = new VersionApplicableUpdatePage();
    expect(await versionApplicableUpdatePage.getPageTitle()).to.eq('adnApplicationApp.versionApplicable.home.createOrEditLabel');
    await versionApplicableUpdatePage.cancel();
  });

  it('should create and save VersionApplicables', async () => {
    const nbButtonsBeforeCreate = await versionApplicableComponentsPage.countDeleteButtons();

    await versionApplicableComponentsPage.clickOnCreateButton();

    await promise.all([
      versionApplicableUpdatePage.setUidVersionApplicableInput('uidVersionApplicable'),
      versionApplicableUpdatePage.setNameVersionApplicableInput('nameVersionApplicable'),
      versionApplicableUpdatePage.setCommentInput('comment'),
      versionApplicableUpdatePage.setDescriptionInput('description'),
      versionApplicableUpdatePage.setCreateDateInput('createDate'),
      versionApplicableUpdatePage.setModifyByInput('modifyBy'),
      versionApplicableUpdatePage.setModifidDateInput('modifidDate'),
      versionApplicableUpdatePage.productSelectLastOption(),
    ]);

    await versionApplicableUpdatePage.save();
    expect(await versionApplicableUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await versionApplicableComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last VersionApplicable', async () => {
    const nbButtonsBeforeDelete = await versionApplicableComponentsPage.countDeleteButtons();
    await versionApplicableComponentsPage.clickOnLastDeleteButton();

    versionApplicableDeleteDialog = new VersionApplicableDeleteDialog();
    expect(await versionApplicableDeleteDialog.getDialogTitle()).to.eq('adnApplicationApp.versionApplicable.delete.question');
    await versionApplicableDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(versionApplicableComponentsPage.title), 5000);

    expect(await versionApplicableComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
