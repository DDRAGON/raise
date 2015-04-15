/**
 * 専用テーブル情報を画面に出力する。
 * @param jsonObj dedicatedTables
 */
function displayDedicatedTables(dedicatedTables) {
	$("#dedicatedTables").remove();
	$("#dedicatedTableInfo").append('<div id="dedicatedTables"></div>');
	for (var key in dedicatedTables) {
		var dedicatedTable = dedicatedTables[key];
		$("#dedicatedTables").append(
			createDedicatedTableDom(dedicatedTable)
		)
	}
}

/**
 * 専用テーブル用のdiv要素を作成。
 * @param jsonObj dedicatedTable
 */
function createDedicatedTableDom(dedicatedTable) {
	var dedicatedTableDom = '';
	dedicatedTableDom += '<div>';
	dedicatedTableDom += dedicatedTable.id;
	dedicatedTableDom += '  <div id="' + dedicatedTable.id + '">';
	for (var addedMultiQrCodeReaderId in dedicatedTable.addedMultiQrCodeReaders) {
		var addedMultiQrCodeReader = dedicatedTable.addedMultiQrCodeReaders[addedMultiQrCodeReaderId];
		dedicatedTableDom += '席：' + addedMultiQrCodeReader.seatId + '番、';
		dedicatedTableDom += 'ID： ' + addedMultiQrCodeReaderId;
		dedicatedTableDom += '<br>';
	}
	dedicatedTableDom += '  </div>';
	dedicatedTableDom += '</div>';
	return dedicatedTableDom;
}

/**
 * マルチQRコードリーダー情報を画面に出力する。
 * @param jsonObj multiQrCodeReaders
 */
function displayMultiQrCodeReaders(multiQrCodeReaders) {
	$("#multiQrCodeReaders").remove();
	$("#multiQrCodeReaderInfo").append('<div id="multiQrCodeReaders"></div>');
	for (var key in multiQrCodeReaders) {
		var multiQrCodeReader = multiQrCodeReaders[key];
		$("#multiQrCodeReaders").append(
			createMultiQrCodeReaderDom(multiQrCodeReader)
		)
	}
}

/**
 * マルチQRコードリーダー用のdiv要素を作成。
 * @param jsonObj multiQrCodeReader
 */
function createMultiQrCodeReaderDom(multiQrCodeReader) {
	var multiQrCodeReaderDom = '';
	multiQrCodeReaderDom += '<div>';
	multiQrCodeReaderDom += multiQrCodeReader.id;
	multiQrCodeReaderDom += '<div id="' + multiQrCodeReader.id + '"></div>';
	multiQrCodeReaderDom += '</div>';
	return multiQrCodeReaderDom;
}

/**
 * 接続が切れた時用のメッセージを表示する。
 */
function displayDisConnected() {
	$("#dedicatedTableInfo").hide();
	$("#multiQrCodeReaderInfo").hide();
	$("#disConnectedMessage").show();
}

function assignMultiQrCodeReader() {
	$("#assignFailMessage").hide();
	var multiQrCodeReaderId = $('#multiQrCodeReaderIdInput').val();
	var dedicatedTableId    = $('#dedicatedTableIdInput').val();
	var seatId              = $('#seatIdInput').val();

	if(!multiQrCodeReaderId || multiQrCodeReaderId === "") { // 割り当て失敗
		displayAssignFailed ('マルチQRコードリーダーID未入力'); // 割り当て失敗メッセージを表示
		return;
	}

	if (!dedicatedTableId || dedicatedTableId === "") {
		displayAssignFailed ('専用テーブルID未入力'); // 割り当て失敗メッセージを表示
		return;
	}

	if (!seatId || seatId === "") {
		displayAssignFailed ('座席番号未入力'); // 割り当て失敗メッセージを表示
		return;
	}

	sendAssign(multiQrCodeReaderId, dedicatedTableId, seatId); // 割り当て情報送信！
	$('#multiQrCodeReaderIdInput').val('');
	$('#dedicatedTableIdInput').val('');
	$('#seatIdInput').val('');
}

function displayAssignFailed (message) {
	$('#assignFailedMessage').html("" + message);
	$("#assignFail").show(); // 割り当て失敗メッセージを表示
}

