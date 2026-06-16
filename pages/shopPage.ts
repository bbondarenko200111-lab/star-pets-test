import { Page, Locator } from '@playwright/test';

export class ShopPage {
  readonly page: Page;
  readonly buyButton: Locator;
  readonly withdrawButton: Locator;
  readonly priceLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buyButton = page.locator('[data-testid="buy-button"]');
    this.withdrawButton = page.locator('[data-testid="withdraw-button"]');
    this.priceLabel = page.locator('[data-testid="item-price"]');
  }

  async open(itemId?: number) {
    const url = itemId ? `/shop/${itemId}` : '/shop';
    await this.page.goto(url);
  }

  async clickBuy() {
    await this.buyButton.click();
  }

  async waitForWithdrawButton(timeout = 15000) {
    await this.withdrawButton.waitFor({ state: 'visible', timeout });
  }

  async getPriceText() {
    return this.priceLabel.textContent();
  }
}
