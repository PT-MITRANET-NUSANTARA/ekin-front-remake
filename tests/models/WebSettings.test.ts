import Model from '@/models/Model';
import WebSettings, { IncomingApiData } from '@/models/WebSettings';
import { describe, expect, it } from 'vitest';

describe('WebSettings', () => {
  it('should be a valid model', () => {
    expect(WebSettings).toBeDefined();
    expect(WebSettings.prototype).toBeDefined();
    expect(WebSettings.prototype.constructor).toBeDefined();
    expect(WebSettings.prototype instanceof Model).toBeTruthy();
  });

  it('should registered as a children of Model', () => {
    expect(Model.children.web_settings).toBe(WebSettings);
  });

  it('should be able to create a new Web Settings', () => {
    const webSettings = new WebSettings(1, 'Malik');

    expect(webSettings).toBeDefined();
    expect(webSettings.id).toBe(1);
    expect(webSettings.name).toBe('Malik');
  });

  it('should be able to create a new Web Settings from API data', () => {
    const apiData: IncomingApiData = {
      id: 1,
      name: 'Malik',
    };
    const webSettings = WebSettings.fromApiData(apiData);

    expect(webSettings).toBeDefined();
    expect(webSettings.id).toBe(apiData.id);
    expect(webSettings.name).toBe(apiData.name);
  });

  it('should be able to create a new Web Settings array from API data array', () => {
    const apiData: IncomingApiData[] = [
      {
        id: 1,
        name: 'Rapik'
      },
      {
        id: 2,
        name: 'Aqshal'
      }
    ];
    const webSettingses = WebSettings.fromApiData(apiData);

    expect(webSettingses).toBeDefined();
    expect(webSettingses.length).toBe(apiData.length);
    expect(webSettingses[0].id).toBe(apiData[0].id);
    expect(webSettingses[0].name).toBe(apiData[0].name);
    expect(webSettingses[1].id).toBe(apiData[1].id);
    expect(webSettingses[1].name).toBe(apiData[1].name);
  });

  it('should be able to convert Web Settings to API data', () => {
    const webSettings = new WebSettings(1, 'Malik');
    const apiData = WebSettings.toApiData(webSettings);

    expect(apiData).toBeDefined();
    expect(apiData.id).toBe(webSettings.id);
    expect(apiData.name).toBe(webSettings.name);
  });

  it('should be able to convert Web Settings array to API data array', () => {
    const webSettingses = [new WebSettings(1, 'Malik'), new WebSettings(2, 'Fauzan')];
    const apiData = WebSettings.toApiData(webSettingses);

    expect(apiData).toBeDefined();
    expect(apiData.length).toBe(webSettingses.length);
    expect(apiData[0].id).toBe(webSettingses[0].id);
    expect(apiData[0].name).toBe(webSettingses[0].name);
    expect(apiData[1].id).toBe(webSettingses[1].id);
    expect(apiData[1].name).toBe(webSettingses[1].name);
  });
});
