import { MAP_ITEM_TYPES } from '../../constants/game';

import { getMapItemsByType, getRandomNum } from './helpers';
import { checkPossibleMoves, applyMove } from './actions';
import { renderMove } from './render';

import { GameState, Player } from './types';

type PossibleMove = number[][];

interface MiniMaxNode {
  gameState: GameState;
  score?: number;
  move?: PossibleMove;
  children?: MiniMaxNode[];
}

/**
 * Function renders the chosen best move
 */
function aiMove(): Promise<void> {
  return new Promise((resolve) => {
    const decisionTree: MiniMaxNode = aiBuildDecisionTree({
      gameState: {
        boardMap: this.boardMap,
        lockedCell: this.lockedCell,
        players: this.players,
        isGameOver: this.isGameOver,
      },
    }, 3, true);

    aiMiniMax(decisionTree, true);

    console.info(decisionTree);

    const bestNodes: MiniMaxNode[] = decisionTree.children.filter((node: MiniMaxNode) => {
      return node.score === decisionTree.score;
    });

    const bestMove: number[][] = bestNodes[getRandomNum(0, bestNodes.length - 1)].move;
    const [[itemY, itemX], [cellY, cellX]] = bestMove;

    renderMove.call(this, itemX, itemY, cellX, cellY).then(resolve);
  });
}

/**
 * Build a tree of players' possible moves starting from the current game state
 * to the given depth
 *
 * @param node
 * @param depth
 * @param maximizingPlayer
 */
function aiBuildDecisionTree(node: MiniMaxNode, depth: number, maximizingPlayer: boolean): MiniMaxNode {
  const itemType: number = maximizingPlayer ? MAP_ITEM_TYPES.red.statue : MAP_ITEM_TYPES.blue.statue;
  const ownStatues: number[][] = getMapItemsByType(node.gameState.boardMap, itemType);
  let result: MiniMaxNode = { ...node };
  const children: MiniMaxNode[] = [];

  for (const statue of ownStatues) {
    const possibleMoves: number[][] | undefined = checkPossibleMoves(node.gameState, statue[1], statue[0]);

    if (possibleMoves === undefined || !Array.isArray(possibleMoves) || possibleMoves.length === 0) {
      continue;
    }

    for (const possibleMove of possibleMoves) {
      const [itemY, itemX] = statue;
      const [cellY, cellX] = possibleMove;
      const [, newState] = applyMove({ ...node.gameState }, itemX, itemY, cellX, cellY);
      const newNode: MiniMaxNode = {
        gameState: { ...newState },
        move: [statue, possibleMove],
      };

      if (depth === 1 || newState.isGameOver) {
        children.push(newNode);
      } else {
        children.push(aiBuildDecisionTree(newNode, depth - 1, !maximizingPlayer));
      }
    }

    result = {
      ...result,
      children,
    };
  }

  return result;
}

/**
 * Use minimax algorithm to get the best move(s) for the computer player
 *
 * @param node
 * @param maximizingPlayer
 */
function aiMiniMax(node: MiniMaxNode, maximizingPlayer: boolean): number {
  const itemType: number = !maximizingPlayer ? MAP_ITEM_TYPES.red.statue : MAP_ITEM_TYPES.blue.statue;

  if (!node.children) {
    const evaluation = aiEvaluateGameState(node.gameState, itemType);

    node.score = evaluation;

    return evaluation;
  }

  let bestMoveValue: number = maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

  if (maximizingPlayer) {
    node.children.forEach((child: MiniMaxNode) => {
      bestMoveValue = Math.max(bestMoveValue, aiMiniMax(child, false));
    });
  } else {
    node.children.forEach((child: MiniMaxNode) => {
      bestMoveValue = Math.min(bestMoveValue, aiMiniMax(child, true));
    });
  }

  node.score = bestMoveValue;

  return bestMoveValue;
}

/**
 * Heuristically evaluate game state for the specified player
 *
 * @param gameState
 * @param itemType
 */
function aiEvaluateGameState(gameState: GameState, itemType: number): number {
  if (gameState.isGameOver) {
    return 100;
  }

  const player: Player = gameState.players[itemType === MAP_ITEM_TYPES.red.statue ? 'red' : 'blue'];
  const enemyPlayer: Player = gameState.players[itemType === MAP_ITEM_TYPES.red.statue ? 'blue' : 'red'];
  let result = 0;

  result += 10 - player.beads;
  result += player.captured;
  result -= 10 - enemyPlayer.beads;
  result -= enemyPlayer.captured;

  return result;
}

export { aiMove };
