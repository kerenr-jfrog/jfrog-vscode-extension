import * as path from 'path';
import * as vscode from 'vscode';
import { DependenciesTreeNode } from '../treeDataProviders/dependenciesTree/dependenciesTreeNode';
import { TreesManager } from '../treeDataProviders/treesManager';
import { YarnUtils } from '../utils/yarnUtils';
import { AbstractHoverProvider } from './abstractHoverProvider';

export class YarnHover extends AbstractHoverProvider {
    constructor(treesManager: TreesManager) {
        super(YarnUtils.DOCUMENT_SELECTOR, treesManager);
    }

    /** @override */
    public getNodeByLocation(document: vscode.TextDocument, cursorPosition: vscode.Position): DependenciesTreeNode | undefined {
        let dependenciesTree: DependenciesTreeNode | undefined = this._treesManager.dependenciesTreeDataProvider.getDependenciesTreeNode(
            YarnUtils.PKG_TYPE,
            path.dirname(document.uri.fsPath)
        );
        if (!dependenciesTree) {
            return;
        }
        for (const child of dependenciesTree.children) {
            let pos: vscode.Position[] = YarnUtils.getDependencyPos(document, child);
            let range: vscode.Range = new vscode.Range(pos[0], pos[1]);
            if (range.contains(cursorPosition)) {
                return child;
            }
        }
        return undefined;
    }
}
