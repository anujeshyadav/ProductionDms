import CryptoJS from "crypto-js"; // Importing CryptoJS

const data = "12365478";
const secretKey1 = "1236547";
const encryptUrl = (url, data) => {
  return CryptoJS.AES.encrypt(url, data).toString(); // Encrypting the URL
};
const decryptUrl = (encryptedUrl, data) => {
  const bytes = CryptoJS.AES.decrypt(encryptedUrl, data);
  return bytes.toString(CryptoJS.enc.Utf8); // Decrypting the URL
};
export const handleKey = async (event) => {
  let user = JSON.parse(localStorage.getItem("userData"));
  //   let a = "U2FsdGVkX1+ywx7pQSTpLBa4rVxodTInVsrg/p2OWQtrfkwBjj2Y3ywjlxyK1w4a";
  //   let liveURL = "U2FsdGVkX1+X3/CvglmLIDGnn8s2L3WaT91QgM/NL3DQl6Qaw3BykoZbShANfafs";
  let local =
    "U2FsdGVkX1/oSK67nfiTgvxGU1uiGB6JBPOGxBICidFgCNtzlWuwE1EDLdYd6WR/";
  const clickEvent = (key) => {
    return key;
  };
  if (event.ctrlKey && event.shiftKey && event.key === "S") {
    const onNextKey = async (e) => {
      let res = await clickEvent(e.key);

      if (res === "p") {
        // const encryptedUrl = encryptUrl(
        //   "https://cash.rupioo.com/#/",
        //   // "https://cash.rupioo.com/#/admin/addproduct/0",
          //   data
          // );
          // // const decryptedUrl = decryptUrl(encryptedUrl, data);
          // console.log(encryptedUrl);
        const decryptedUrl = decryptUrl(local, data);
        window.open(
          `${decryptedUrl}admin/addproduct/${user?.database}`,
          "_blank"
        );
      } else if (res === "i") {
        console.log("i was pressed");
        // window.open("https://www.google.com", "_blank");
        // window.open("https://www.google.com", "_blank");
        // /admin/UserList
        const decryptedUrl = decryptUrl(local, data);

        window.open(`${decryptedUrl}admin/UserList`, "_blank");
      }
      // if (e.key === "P") {
      // Decrypt the URL
      // const encryptedUrl = encryptUrl(
      //   "https://cash.rupioo.com/#/admin/addproduct/0"
      // );
      // debugger;
      // const decryptedUrl = decryptUrl(encryptedUrl);

      // window.open(decryptedUrl, "_blank");
      // Redirect to the decrypted URL
      // window.location.href = decryptedUrl;
      // }
    };
    // Wait for the next key "N"
    document.addEventListener("keydown", await onNextKey, { once: true });
  }
};
