import { Component, OnInit } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';

/** Flat node with expandable and level information */
interface FriendDataFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isExpanded?: boolean;
  // Extensions
  hasHandler: boolean; // used as for a directive
  handler?: Function; // A function to handle, if defined for the node data
  userName?: string; // Could be different than name - passing it like this just makes it a bit easier to handle from there
}

@Component({
  selector: 'app-meta-friend-list',
  templateUrl: './meta-friend-list.component.html',
  styleUrls: ['./meta-friend-list.component.css']
})
export class MetaFriendListComponent implements OnInit {
  treeControl = new FlatTreeControl<FriendDataFlatNode>(
    node => node.level,
    node => node.expandable,
  );
  TREE_DATA: FriendDataFlatNode[] = [
    {
      name: 'Online',
      expandable: true,
      hasHandler: false,
      level: 0,
    },
    {
      name: "Quest Idler: Retro Edition",
      expandable: true,
      hasHandler: false,
      level: 1
    },
      {
        name: 'TryAgain34',
        expandable: true,
        hasHandler: false,
        level: 2,
      },   
        {
          name: 'In-Game: Quest Idler: Retro Edition',
          expandable: false,
          hasHandler: false,
          level: 3,
        },
        {
          name: 'Send Private Message',
          userName: 'TryAgain34',
          expandable: false,
          hasHandler: true,
          level: 3,
          handler: (node: FriendDataFlatNode) => { 
            this.handleTreeNode(node);
          }
        },
        {
          name: 'View Profile',
          userName: 'TryAgain34',
          expandable: false,
          hasHandler: true,
          level: 3,
          handler: (node: FriendDataFlatNode) => { 
            this.handleTreeNode(node);
          }
        },
    {
      name: '__purgeMe__',
      expandable: true,
      hasHandler: false,
      level: 2,
    },
      {
        name: 'Send Private Message',
        expandable: false,
        hasHandler: false,
        level: 3,
      },
    {
      name: 'SylvainTran',
      expandable: true,
      hasHandler: false,
      level: 2,
    },
    {
      name: 'herohero',
      expandable: true,
      hasHandler: false,
      level: 2,
    },
    {
      name: 'Chat Homes 3D',
      expandable: true,
      hasHandler: false,
      level: 1,
    },
    {
      name: 'Other Games',
      expandable: true,
      hasHandler: false,
      level: 1,
    },
    {
      name: 'Offline',
      expandable: true,
      hasHandler: false,
      level: 0,
    }
  ];
  
  dataSource = new ArrayDataSource(this.TREE_DATA);

  hasChild = (_: number, node: FriendDataFlatNode) => node.expandable;
  hasHandler = (_: number, node: FriendDataFlatNode) => node.hasHandler;

  getParentNode(node: FriendDataFlatNode) {
    const nodeIndex = this.TREE_DATA.indexOf(node);

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (this.TREE_DATA[i].level === node.level - 1) {
        return this.TREE_DATA[i];
      }
    }

    return null;
  }

  shouldRender(node: FriendDataFlatNode) {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!parent.isExpanded) {
        return false;
      }
      parent = this.getParentNode(parent);
    }
    return true;
  }

  /**
   * The controller for the cdk tree's node that
   * has a handler defined on it in the data source.
   * @param node : the friend data flat node info passed in the template
   */
  handleTreeNode(node: FriendDataFlatNode) {
    if(node.name === 'Send Private Message') {
      this.sendPM(node);
    } else if(node.name === 'View Profile') {
      this.viewProfile(node);
    }
  }

  sendPM(node: FriendDataFlatNode) {
    console.log("Sending pm!!!!" + node.userName);
    alert("Sent a private message to " + node.userName);
  }

  checkConversationHistory(node: FriendDataFlatNode) {
    
  }

  viewProfile(node: FriendDataFlatNode) {
    console.log("View profile!!!!" + node.userName)
  }

  constructor() {}

  ngOnInit(): void {}

}
