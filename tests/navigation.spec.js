const { test, expect } = require("@playwright/test");

test("has link do logowania", async ({ page }) => {
  // 1. Wejście na stronę główną aplikacji
  await page.goto("http://localhost:3000/");

  // 2. Kliknięcie w link „Zaloguj się” prowadzący do strony logowania
  await page.click("text=Zaloguj się");

  // 3. Sprawdzenie, że otworzyła się strona logowania
  await expect(page).toHaveURL("http://localhost:3000/user/signin");

  // 4. Sprawdzenie, że na stronie logowania jest nagłówek „Logowanie”
  await expect(page.locator("h1")).toContainText("Logowanie");
});



