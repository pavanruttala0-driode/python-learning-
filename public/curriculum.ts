export interface Challenge {
  id: string;
  title: string;
  tier: 'Novice' | 'Adept' | 'Master';
  description: string;
  starterCode: string;
  testCode: string;
  xpReward: number;
  coinReward: number;
}

export const CURRICULUM: Challenge[] = [
  {
    id: 'py-01',
    tier: 'Novice',
    title: '1. Variables & Types',
    description: 'Declare a variable named "hero_name" with the string "PyMage" and "hero_hp" with the integer 100.',
    starterCode: '# Initialize hero stats\nhero_name = ""\nhero_hp = 0\n',
    testCode: 'assert hero_name == "PyMage", "hero_name is incorrect"\nassert hero_hp == 100, "hero_hp is incorrect"',
    xpReward: 50,
    coinReward: 10,
  },
  {
    id: 'py-02',
    tier: 'Novice',
    title: '2. Conditional Gates',
    description: 'Write a function can_pass(level) that returns True if level is 10 or greater, otherwise False.',
    starterCode: 'def can_pass(level):\n    # Return True or False\n    pass\n',
    testCode: 'assert can_pass(10) == True\nassert can_pass(8) == False\nassert can_pass(15) == True',
    xpReward: 75,
    coinReward: 15,
  },
  {
    id: 'py-03',
    tier: 'Adept',
    title: '3. List Comprehensions',
    description: 'Write double_values(nums) that returns a new list where each number is doubled.',
    starterCode: 'def double_values(nums):\n    return [n * 2 for n in nums]\n',
    testCode: 'assert double_values([1, 2, 3]) == [2, 4, 6]\nassert double_values([]) == []',
    xpReward: 100,
    coinReward: 20,
  },
];

