import * as vscode from '@vscode/test-electron'
import * as gcode from 'gcode-parser'

export default class Extension {
	constructor(private readonly vscode: vscode.ExtensionContext) {}

	public activate() {
		this.vscode.window.registerTextDocumentHighlightProvider(
			new TextDocumentHighlightProvider(this.vscode, this.highlightGCodeLine)
		)
	}

	private highlightGCodeLine(document: vscode.TextDocument, line: number) {
		const lineText = document.lineAt(line).text
		const gcodeLine = gcode.parseLine(lineText)
		const highlights = []
		for (const token of gcodeLine.tokens) {
			if (token.type === 'comment') {
				highlights.push({
					range: new vscode.Range(line, token.start, line, token.end),
					kind: vscode.TextHighlightKind.Comment
				})
			} else if (token.type === 'command') {
				highlights.push({
					range: new vscode.Range(line, token.start, line, token.end),
					kind: vscode.TextHighlightKind.Keyword
				})
			}
		}
		return highlights
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
