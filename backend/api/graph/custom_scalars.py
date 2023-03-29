from graphene.types import Scalar

class filterField(Scalar):
    '''custom scalar for the filter type'''

    @staticmethod
    def serialize(dt):
        try:
            return float(dt)
        except:
            pass

        return dt

    @staticmethod
    def parse_literal(node, _variables=None):
        try:
            return float(node.value)
        except:
            pass
        
        return node.value

    @staticmethod
    def parse_value(value):
        try:
            return float(value)
        except:
            pass
        
        return value