import {Alert} from "react-native";

export const CURRENCY_MAP: Record<string, string> = {
    'pln': 'PLN', 'euro': 'EUR', 'eur': 'EUR', 'dolar': 'USD', 'usd': 'USD',
    'yen': 'JPY', 'jpy': 'JPY', 'korona czeska': 'CZK', 'czk': 'CZK',
    'won koreański': 'KRW', 'krw': 'KRW', 'forint węgierski': 'HUF', 'huf': 'HUF',
    'frank szwajcarski': 'CHF', 'chf': 'CHF'
};

// Sztywne kursy awaryjne (gdyby użytkownik włączył apkę bez sieci za pierwszym razem)
const FALLBACK_RATES: Record<string, number> = {
    'EUR': 4.32, 'USD': 3.95, 'JPY': 0.025, 'CZK': 0.17, 'KRW': 0.0029, 'HUF': 0.011, 'CHF': 4.45,
};

// --- CACHE W PAMIĘCI APLIKACJI ---
// Przechowujemy tu pobrane kursy, żeby nie pytać API NBP przy każdej operacji
let cachedRates: Record<string, number> = {
    'PLN': 1.0 // PLN względem PLN to zawsze 1
};
let isCacheLoaded = false;

/**
 * Helper pobierający kod ISO
 */
export const getCurrencyCode = (input: string): string => {
    if (!input) return 'PLN';
    const normalized = input.toLowerCase().trim();
    return CURRENCY_MAP[normalized] || 'PLN';
};

/**
 * Główna funkcja inicjalizująca – woła API NBP RAZ dla wszystkich walut z tabeli A.
 * Możesz ją wywołać np. w App.tsx przy starcie aplikacji lub pozwolić,
 * by odpaliła się automatycznie przy pierwszej próbie konwersji.
 */
export const preloadAllRates = async (): Promise<void> => {
    try {
        // 🔥 POPRAWIONY URL: Usunięty slash przed "?format=json"
        const response = await fetch('https://api.nbp.pl/api/exchangerates/tables/a?format=json', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // 🔥 DODANY USER-AGENT: Informuje serwer, że jesteśmy aplikacją mobilną
                'User-Agent': 'HomeBudgetMobileApp/1.0'
            }
        });

        if (!response.ok) throw new Error(`Błąd tabeli NBP: ${response.status}`);

        const data = await response.json();
        const ratesList = data[0]?.rates || [];

        ratesList.forEach((item: { code: string; mid: number }) => {
            if (item.code in FALLBACK_RATES) {
                cachedRates[item.code] = item.mid;
            }
        });

        isCacheLoaded = true;
        console.log('[NBP Service] Pomyślnie zaciągnięto i zapisano kursy z NBP:', cachedRates);
    } catch (error) {
        console.warn('[NBP Service] Problem z API. Ładowanie kursów offline (fallback).', error);

        Object.keys(FALLBACK_RATES).forEach(code => {
            cachedRates[code] = FALLBACK_RATES[code];
        });
        isCacheLoaded = true;

        Alert.alert(
            'Tryb Offline',
            'Nie udało się pobrać aktualnych kursów walut z NBP. Aplikacja tymczasowo korzysta z awaryjnych kursów offline.',
            [{ text: 'Rozumiem' }]
        );
    }
};

/**
 * Pobiera kurs waluty bezpośrednio z pamięci podręcznej (synchronicznie i błyskawicznie)
 */
export const fetchCurrencyRate = async (currencyInput: string): Promise<number> => {
    const code = getCurrencyCode(currencyInput);

    if (code === 'PLN') return 1;

    // Jeśli z jakiegoś powodu cache nie jest jeszcze gotowy, pobieramy go teraz
    if (!isCacheLoaded) {
        await preloadAllRates();
    }

    // Zwracamy kurs z pamięci podręcznej, a jeśli go tam nie ma, awaryjny kurs stały
    return cachedRates[code] || FALLBACK_RATES[code] || 1;
};

/**
 * Przelicza podaną kwotę z waluty obcej na PLN bez opóźnień sieciowych
 */
export const convertToPLN = async (amount: number, fromCurrency: string): Promise<number> => {
    const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    const rate = await fetchCurrencyRate(fromCurrency);

    return Math.round(safeAmount * rate * 100) / 100;
};