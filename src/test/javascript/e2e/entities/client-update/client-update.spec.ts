import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ClientUpdateComponentsPage, ClientUpdateDeleteDialog, ClientUpdateUpdatePage } from './client-update.page-object';

const expect = chai.expect;

describe('ClientUpdate e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let clientUpdateComponentsPage: ClientUpdateComponentsPage;
  let clientUpdateUpdatePage: ClientUpdateUpdatePage;
  let clientUpdateDeleteDialog: ClientUpdateDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ClientUpdates', async () => {
    await navBarPage.goToEntity('client-update');
    clientUpdateComponentsPage = new ClientUpdateComponentsPage();
    await browser.wait(ec.visibilityOf(clientUpdateComponentsPage.title), 5000);
    expect(await clientUpdateComponentsPage.getTitle()).to.eq('adnApplicationApp.clientUpdate.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(clientUpdateComponentsPage.entities), ec.visibilityOf(clientUpdateComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ClientUpdate page', async () => {
    await clientUpdateComponentsPage.clickOnCreateButton();
    clientUpdateUpdatePage = new ClientUpdateUpdatePage();
    expect(await clientUpdateUpdatePage.getPageTitle()).to.eq('adnApplicationApp.clientUpdate.home.createOrEditLabel');
    await clientUpdateUpdatePage.cancel();
  });

  it('should create and save ClientUpdates', async () => {
    const nbButtonsBeforeCreate = await clientUpdateComponentsPage.countDeleteButtons();

    await clientUpdateComponentsPage.clickOnCreateButton();

    await promise.all([clientUpdateUpdatePage.clientSelectLastOption(), clientUpdateUpdatePage.updateSelectLastOption()]);

    await clientUpdateUpdatePage.save();
    expect(await clientUpdateUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await clientUpdateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ClientUpdate', async () => {
    const nbButtonsBeforeDelete = await clientUpdateComponentsPage.countDeleteButtons();
    await clientUpdateComponentsPage.clickOnLastDeleteButton();

    clientUpdateDeleteDialog = new ClientUpdateDeleteDialog();
    expect(await clientUpdateDeleteDialog.getDialogTitle()).to.eq('adnApplicationApp.clientUpdate.delete.question');
    await clientUpdateDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(clientUpdateComponentsPage.title), 5000);

    expect(await clientUpdateComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
