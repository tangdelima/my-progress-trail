import { MyProgressPage } from './app.po';

describe('my-progress App', function() {
  let page: MyProgressPage;

  beforeEach(() => {
    page = new MyProgressPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
