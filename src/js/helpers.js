import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async (url, uploadData = undefined) => {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteData = async url => {
  try {
    const fetchPromise = fetch(url, {
      method: 'DELETE',
    });

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
  } catch (err) {
    throw err;
  }
};

// export const getJSON = async url => {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJSON = async (url, uploadData) => {
//   try {
//     const fetchPromise = fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
