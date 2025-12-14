const { test, expect } = require("@playwright/test");

const BASE_URL = "http://localhost:3000";
const TEST_EMAIL = "test@lab.com";
const TEST_PASSWORD = "Test123!";

test.describe("proces logowania", () => {
  test("niezalogowany użytkownik jest przekierowany na stronę logowania", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/user/profile`);
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/user/signin`));
    await expect(page.locator("h1")).toContainText("Logowanie");
  });

  test("po zalogowaniu można wejść na stronę profilu", async ({ page }) => {
    // Wejście na stronę logowania
    await page.goto(`${BASE_URL}/user/signin`);

    // Wypełnienie formularza logowania
    await page.fill('input#email', TEST_EMAIL);
    await page.fill('input#password', TEST_PASSWORD);
    
    // Submit formularza logowania i oczekiwanie na nawigację lub błąd
    await page.click('button[type="submit"]');
    
    // Czekamy na nawigację lub komunikat błędu
    try {
      await page.waitForURL(new RegExp(`${BASE_URL}(/|/user/verify)`), { timeout: 10000 });
    } catch (e) {
      // Jeśli nie ma nawigacji, sprawdź czy są błędy
      await page.waitForTimeout(2000); // Czekamy na pojawienie się błędu
      const errorMessage = await page.locator('.bg-red-50, [class*="red"]').textContent().catch(() => null);
      if (errorMessage) {
        throw new Error(`Logowanie nie powiodło się: ${errorMessage}`);
      }
      // Jeśli nie ma błędu, sprawdź URL
      const currentURL = page.url();
      if (currentURL.includes('/user/signin')) {
        throw new Error('Logowanie nie powiodło się - użytkownik pozostał na stronie logowania bez komunikatu błędu');
      }
    }

    // Czekamy chwilę, aby sesja została w pełni ustanowiona
    await page.waitForTimeout(2000);

    // Sprawdzenie czy przejście do ścieżki z profilem użytkownika jest możliwe
    await page.goto(`${BASE_URL}/user/profile`, { waitUntil: 'load', timeout: 20000 });
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/user/profile`));
    
    // Czekamy aż zniknie komunikat "Ładowanie danych użytkownika..." (jeśli jest)
    await page.waitForFunction(
      () => !document.body.textContent?.includes('Ładowanie danych użytkownika'),
      { timeout: 10000 }
    ).catch(() => {}); // Ignoruj jeśli nie ma tego tekstu
    
    // Czekamy na pojawienie się formularza profilu - sprawdzamy kilka możliwych selektorów
    // Czekamy na którykolwiek z elementów: form, input#displayName lub label[for='displayName']
    try {
      await page.waitForSelector("form", { state: 'visible', timeout: 5000 });
    } catch {
      try {
        await page.waitForSelector("input#displayName", { state: 'visible', timeout: 5000 });
      } catch {
        await page.waitForSelector("label[for='displayName']", { state: 'visible', timeout: 5000 });
      }
    }
    
    // Sprawdzenie czy strona profilu jest widoczna - sprawdzamy czy którykolwiek element jest widoczny
    const hasForm = await page.locator("form").isVisible().catch(() => false);
    const hasInput = await page.locator("input#displayName").isVisible().catch(() => false);
    const hasLabel = await page.locator("label[for='displayName']").isVisible().catch(() => false);
    
    expect(hasForm || hasInput || hasLabel).toBe(true);
  });
});



