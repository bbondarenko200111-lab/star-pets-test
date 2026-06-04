import { test, expect } from '@playwright/test';
import { ShopPage } from '../pages/shopPage';
import { testItem } from '../fixtures/testData';

test('Динамическая карточка товара — покупка и появление кнопки "Вывести"', async ({ page }) => {
  const shopPage = new ShopPage(page);

  await shopPage.open(testItem.id);
  await expect(shopPage.priceLabel).toHaveText(`${testItem.price} €`);

  await shopPage.clickBuy();

  // Ожидание появления кнопки "Вывести" после ответа от WebSocket
  await shopPage.waitForWithdrawButton();
});
