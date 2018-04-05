import * as template from './groupings.component.html';

import {
    Component,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { CipherType } from 'jslib/enums/cipherType';

import { CollectionView } from 'jslib/models/view/collectionView';
import { CipherView } from 'jslib/models/view/cipherView';
import { FolderView } from 'jslib/models/view/folderView';

import { CollectionService } from 'jslib/abstractions/collection.service';
import { CipherService } from 'jslib/abstractions/cipher.service';
import { FolderService } from 'jslib/abstractions/folder.service';

import { GroupingsComponent as BaseGroupingsComponent } from 'jslib/angular/components/groupings.component';

@Component({
    selector: 'app-vault-groupings',
    template: template,
})
export class GroupingsComponent extends BaseGroupingsComponent implements OnInit {
    ciphers: CipherView[];
    favoriteCiphers: CipherView[];
    folderCounts = new Map<string, number>();
    collectionCounts = new Map<string, number>();
    typeCounts = new Map<CipherType, number>();

    constructor(collectionService: CollectionService, folderService: FolderService,
        private cipherService: CipherService, private router: Router) {
        super(collectionService, folderService);
    }

    async ngOnInit() {
        super.load();
        super.loaded = false;
        await this.loadCiphers();
        super.loaded = true;
    }

    async loadCiphers() {
        this.ciphers = await this.cipherService.getAllDecrypted();
        this.ciphers.forEach((c) => {
            if (c.favorite) {
                if (this.favoriteCiphers == null) {
                    this.favoriteCiphers = [];
                }
                this.favoriteCiphers.push(c);
            }

            if (this.typeCounts.has(c.type)) {
                this.typeCounts.set(c.type, this.typeCounts.get(c.type) + 1);
            } else {
                this.typeCounts.set(c.type, 1);
            }

            if (this.folderCounts.has(c.folderId)) {
                this.folderCounts.set(c.folderId, this.folderCounts.get(c.folderId) + 1);
            } else {
                this.folderCounts.set(c.folderId, 1);
            }

            if (c.collectionIds != null) {
                c.collectionIds.forEach((colId) => {
                    if (this.collectionCounts.has(colId)) {
                        this.collectionCounts.set(colId, this.collectionCounts.get(colId) + 1);
                    } else {
                        this.collectionCounts.set(colId, 1);
                    }
                });
            }
        });
    }

    selectType(type: CipherType) {
        super.selectType(type);
        this.router.navigate(['/ciphers', { queryParams: { type: type } }]);
    }

    selectFolder(folder: FolderView) {
        super.selectFolder(folder);
        this.router.navigate(['/ciphers', { queryParams: { folderId: folder.id } }]);
    }

    selectCollection(collection: CollectionView) {
        super.selectCollection(collection);
        this.router.navigate(['/ciphers', { queryParams: { collectionId: collection.id } }]);
    }
}
