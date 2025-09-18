#include <vector>
#include <unordered_map>
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            
            map[nums[i]] = i;
        }
        
        return {};
    }
};

int main() {
    string line;
    getline(cin, line);
    
    // Parse array from string like "[2,7,11,15]"
    vector<int> nums;
    
    // Remove brackets and spaces
    string cleaned = "";
    for (char c : line) {
        if (c != '[' && c != ']' && c != ' ') {
            cleaned += c;
        }
    }
    
    // Split by comma
    stringstream ss(cleaned);
    string num;
    
    while (getline(ss, num, ',')) {
        if (!num.empty()) {
            nums.push_back(stoi(num));
        }
    }
    
    int target;
    cin >> target;
    
    Solution sol;
    vector<int> result = sol.twoSum(nums, target);
    
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    
    return 0;
}