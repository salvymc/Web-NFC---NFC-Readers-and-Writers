function copy() {
  var copyText = document.getElementById("codice");
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
}

function makecode(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function writeNFC() {
  modal.style.display = "block";

  let string_url = $("#codice").val();
  const ndef = new NDEFReader();
  try {
    await ndef.write({
      records: [
        {
          recordType: "url",
          data: "https://playtag.vip/app/tag.php?tag=" + string_url,
        },
      ],
    });
    modal.style.display = "none";
    $("#scrivi").hide();
    $("#codice").val("");
  } catch {
    alert("Scrittura fallita riprova");
  }
}

async function readNFC() {
  ndef.destroy();
  modal.style.display = "block";
  try {
    const ndef = new NDEFReader();
    await ndef.scan();

    ndef.addEventListener("readingerror", () => {
      alert("Argh! Cannot read data from the NFC tag. Try another one?");
    });

    ndef.addEventListener("reading", ({ message, serialNumber }) => {
      readUrlRecord(message.records[0]);
    });
  } catch (error) {
    alert("Argh! " + error);
  }
}

function readUrlRecord(record) {
  console.assert(record.recordType === "url");
  const textDecoder = new TextDecoder();
  let url = textDecoder.decode(record.data);
  let code = url.replace("https://playtag.vip/app/tag.php?tag=", "");
  alert(`URL: ${url} \n\nCodice: ${code}`);
  $("#scrivi").hide();
  $("#codice").val("");
}

var span = document.getElementsByClassName("close")[0];
var modal = document.getElementById("myModal");
span.onclick = function () {
  modal.style.display = "none";
};
