import { test, expect } from '@playwright/test';
import { ShopPage } from '../../pages/shopPage';
import { testItem } from '../../fixtures/testData';

test.describe('UI тесты магазина', () => {
  test('Динамическая карточка товара — покупка и появление кнопки "Вывести"', async ({ page }) => {
    const shopPage = new ShopPage(page);

    await shopPage.open(testItem.id);
    await expect(shopPage.priceLabel).toHaveText(`${testItem.price} €`);

    await shopPage.clickBuy();

    // Ожидание появления кнопки "Вывести" после ответа от WebSocket
    await shopPage.waitForWithdrawButton();

    // Дополнительная проверка, что кнопка действительно видима и активна
    await expect(shopPage.withdrawButton).toBeEnabled();
  });

  test('Попытка открыть несуществующий товар → 404 страница', async ({ page }) => {
    const shopPage = new ShopPage(page);
    await shopPage.open(999999);
    await expect(page.locator('h1:has-text("404")')).toBeVisible({ timeout: 5000 });
  });
});
