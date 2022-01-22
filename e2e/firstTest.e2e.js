describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to the Read QR screen when user presses tab', async () => {
    await element(by.label('ReadQr tab')).tap();
    await expect(element(by.text('Clear cache'))).toBeVisible();
  });
});
