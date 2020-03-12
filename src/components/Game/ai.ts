import {
  MAP_ITEM_TYPES,
  IDLE_MOVES_LIMIT,
  DIFFICULTY_LEVELS,
  DIFFICULTY_EASY,
} from '../../constants/game';

import { getEnemyType, getPlayerTypeName } from './helpers';
import { checkPossibleMoves, applyMove, checkUnderAttack } from './actions';
import { renderMove } from './render';
import { getRandomNum } from '../../utils/common';
import { getMapItemsByType } from '../../utils/game';

import { GameState, Player } from './types';

type PossibleMove = number[][];

interface MiniMaxNode {
  gameState: GameState;
  score?: number;
  move?: PossibleMove;
  children?: MiniMaxNode[];
  evaluation?: number;
}

let difficultyLevel: number;

/**
 * Function renders the chosen best move
 */
function aiMove(): Promise<void> {
  return new Promise((resolve): void => {
    window.setTimeout((): void => {
      const { boardMap, lockedCell, players, idleMovesCounter, isGameOver } = this;
      const difficultyLevelObject: DifficultyLevel = DIFFICULTY_LEVELS.find((level: DifficultyLevel): boolean => {
        return level.id === this.difficultyLevel;
      });

      ({ difficultyLevel } = this);

      const decisionTree: MiniMaxNode = aiBuildDecisionTree({
        gameState: {
          boardMap,
          lockedCell,
          players,
          idleMovesCounter,
          isGameOver,
        },
      }, difficultyLevelObject?.depth ?? DIFFICULTY_EASY);

      aiMiniMax(decisionTree);

      const bestMove: number[][] = aiGetBestMove(decisionTree);
      const [[itemY, itemX], [cellY, cellX]] = bestMove;

      renderMove.call(this, itemX, itemY, cellX, cellY).then(resolve);
    }, 0);
  });
}

/**
 * After using minimax algorithm for scoring the decision tree leafs,
 * we pick all nodes with the best score for the next move.
 * Then we evaluate each node's state and get nodes with the best state evaluation.
 * Then we pick a random node of the resulting array of nodes --
 * this will be our best move.
 *
 * @param decisionTree
 */
function aiGetBestMove(decisionTree: MiniMaxNode): PossibleMove {
  const bestNodes: MiniMaxNode[] = decisionTree.children.filter((node: MiniMaxNode): boolean => {
    return node.score === decisionTree.score;
  });

  const bestNodesEvaluations: number[] = bestNodes.map((node: MiniMaxNode): number => {
    const evaluation: number = aiEvaluateGameState(node.gameState, MAP_ITEM_TYPES.red.statue);

    node.evaluation = evaluation;

    return evaluation;
  });

  const bestEvaluatedNodes: MiniMaxNode[] = bestNodes.filter((node: MiniMaxNode): boolean => {
    return node.evaluation === Math.max(...bestNodesEvaluations);
  });

  return bestEvaluatedNodes[getRandomNum(0, bestEvaluatedNodes.length - 1)].move;
}

/**
 * Build a tree of players' possible moves starting from the current game state
 * to the given depth
 *
 * @param node
 * @param depth
 * @param itemType
 */
function aiBuildDecisionTree(node: MiniMaxNode, depth: number, itemType = MAP_ITEM_TYPES.red.statue): MiniMaxNode {
  const ownStatues: number[][] = getMapItemsByType(node.gameState.boardMap, itemType);
  const children: MiniMaxNode[] = [];
  let result: MiniMaxNode = { ...node };

  for (const statue of ownStatues) {
    const possibleMoves: number[][] | undefined = checkPossibleMoves(node.gameState, statue[1], statue[0]);

    if (possibleMoves === undefined || !Array.isArray(possibleMoves) || possibleMoves.length === 0) {
      continue;
    }

    for (const possibleMove of possibleMoves) {
      const [itemY, itemX] = statue;
      const [cellY, cellX] = possibleMove;
      const [, newState] = applyMove({ ...node.gameState }, itemX, itemY, cellX, cellY, difficultyLevel);
      const newNode: MiniMaxNode = {
        gameState: { ...newState },
        move: [statue, possibleMove],
      };

      if (depth === 0 || newState.isGameOver) {
        children.push(newNode);
      } else {
        children.push(aiBuildDecisionTree(newNode, depth - 1, getEnemyType(itemType)));
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
function aiMiniMax(node: MiniMaxNode, maximizingPlayer = true): number {
  const itemType: number = maximizingPlayer ? MAP_ITEM_TYPES.red.statue : MAP_ITEM_TYPES.blue.statue;

  if (!node.children) {
    const evaluation = aiEvaluateGameState(node.gameState, itemType);

    node.score = evaluation;

    return evaluation;
  }

  let bestMoveValue: number = maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

  if (maximizingPlayer) {
    node.children.forEach((child: MiniMaxNode): void => {
      bestMoveValue = Math.max(bestMoveValue, aiMiniMax(child, false));
    });
  } else {
    node.children.forEach((child: MiniMaxNode): void => {
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
    return gameState.idleMovesCounter === IDLE_MOVES_LIMIT ? -100 : 100;
  }

  const enemyType: number = getEnemyType(itemType);
  const player: Player = gameState.players[getPlayerTypeName(itemType)];
  const enemyPlayer: Player = gameState.players[getPlayerTypeName(enemyType)];
  const ownStatues: number[][] = getMapItemsByType(gameState.boardMap, itemType);
  const enemyStatues: number[][] = getMapItemsByType(gameState.boardMap, enemyType);
  const getUnderAttack = (statue: number[]): boolean => checkUnderAttack(gameState, statue[1], statue[0]);
  let result = 0;

  result += 10 - player.beads;
  result += player.captured;
  result -= 10 - enemyPlayer.beads;
  result -= enemyPlayer.captured;
  result -= ownStatues.map(getUnderAttack).filter((value: boolean): boolean => value).length;
  result += enemyStatues.map(getUnderAttack).filter((value: boolean): boolean => value).length;

  return result;
}

export { aiMove };
