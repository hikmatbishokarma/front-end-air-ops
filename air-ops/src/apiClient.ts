const BASE_URL = 'http://localhost:3000';

export const updateQuotationState = async (
  id: string,
  state: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${BASE_URL}/quotations/update-quotation-state`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, state }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update state: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error in updateQuotationState:', error);
    throw error;
  }
};

export const upgradeQuotation = async (code: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/quotations/upgrade-quotation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error(`Failed to upgrade quotation: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error in upgradeQuotation:', error);
    throw error;
  }
};
